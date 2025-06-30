import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Sale } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { StockService } from 'src/modules/stocks/services/stock.service';
import { SaleRepository } from '../repositories/sale.repository';
import { SaleItemRepository } from '../repositories/sale-item.repository';
import { DataSource, EntityManager } from 'typeorm';
import { ProductService } from 'src/modules/products/services/product.service';
import { UserService } from 'src/modules/users/services/user.service';
import { SalesSummaryDto } from '../dto/sales-summary.dto';
import { ProductSalesDto } from '../dto/product-sales.dto';
import { SaleAnalyticsDto } from '../dto/sale-analytics-dto';
import { ISaleService } from '../interfaces/sale.interface';
import { BarcodeScanResponseDto } from 'src/modules/products/dto/barcode-scan-response.dto';
import { StockForSaleDto } from 'src/modules/stocks/dto/stock-for-sale.dto';
import { CreateSaleItemDto } from '../dto/create-sale-item.dto';
import { ProductSalesData } from '../interfaces/product-sales-data.interface';

@Injectable()
export class SaleService implements ISaleService {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly saleRepository: SaleRepository,
    private readonly saleItemRepository: SaleItemRepository,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly stockService: StockService,
  ) {}

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.findAll();
  }

  async findById(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findByIdWithRelations(id);
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async remove(id: string): Promise<void> {
    const sale = await this.findById(id);
    await this.saleRepository.remove(sale);
  }

  async findProductWithStockByBarcode(
    barcode: string,
  ): Promise<BarcodeScanResponseDto> {
    const product = await this.productService.findByBarcode(barcode);
    const stocks = await this.stockService.findAllAvailableByProduct(
      product.id,
    );

    if (stocks.length === 0) {
      throw new BadRequestException(
        `No available stock for product: ${product.name}`,
      );
    }

    const availableStocks: StockForSaleDto[] = stocks.map((stock) => {
      const sellingPrice = stock.hasAutomaticDiscount
        ? stock.calculateSellingPriceWithDiscount(5)
        : product.baseSellingPrice;

      return {
        stockId: stock.id,
        quantity: stock.quantity,
        expirationDate: stock.expiration_date,
        daysUntilExpiration: stock.daysUntilExpiration,
        sellingPrice,
        sellingPriceInBRL: sellingPrice / 100,
        hasDiscount: stock.hasAutomaticDiscount,
        discountPercentage: stock.hasAutomaticDiscount
          ? stock.automaticDiscountPercentage
          : undefined,
        urgency: stock.discountUrgency || undefined,
      };
    });

    const hasDiscounts = availableStocks.some((stock) => stock.hasDiscount);
    const lowestPrice = hasDiscounts
      ? Math.min(...availableStocks.map((stock) => stock.sellingPrice))
      : undefined;

    return {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      costPrice: product.costPrice,
      costPriceInBRL: product.costPriceInBRL,
      basePrice: product.baseSellingPrice,
      basePriceInBRL: product.baseSellingPriceInBRL,
      availableStocks,
      hasDiscounts,
      lowestPrice,
      lowestPriceInBRL: lowestPrice ? lowestPrice / 100 : undefined,
    };
  }

  async createSale(createSaleDto: CreateSaleDto): Promise<Sale | null> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const { userId, items } = createSaleDto;

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const sale = await this.createSaleInTransaction(userId, manager);

      const processedItems = await this.processSaleItems(
        items,
        sale.id,
        manager,
      );

      const totalValue = this.calculateSaleTotal(processedItems);
      sale.total_value = totalValue;
      await manager.save(Sale, sale);

      return this.saleRepository.findByIdWithRelations(sale.id);
    });
  }

  async getSaleAnalytics(id: string): Promise<SaleAnalyticsDto> {
    const sale = await this.saleRepository.findByIdWithRelations(id);
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = sale.items.length;
    const averageItemPrice = sale.total_value / totalItems;

    const productBreakdown = sale.items.map((item) => ({
      productId: item.product_id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.quantity * item.unit_price,
      percentageOfSale:
        ((item.quantity * item.unit_price) / sale.total_value) * 100,
    }));

    return {
      saleId: sale.id,
      userId: sale.user_id,
      userName: sale.user.name,
      saleDate: sale.sale_date,
      totalValue: sale.total_value,
      totalValueInBRL: sale.total_value / 100,
      totalItems,
      uniqueProducts,
      averageItemPrice,
      averageItemPriceInBRL: averageItemPrice / 100,
      productBreakdown,
    };
  }

  async getSalesSummary(
    startDate: Date,
    endDate: Date,
  ): Promise<SalesSummaryDto> {
    const sales = await this.saleRepository.findByDateRange(startDate, endDate);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_value, 0);
    const averageSaleValue =
      totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

    const totalItemsSold = sales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );

    // Top selling products
    const productSales = new Map<string, ProductSalesData>();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const key = item.product_id;
        const existing = productSales.get(key) || {
          product: item.product,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.quantity * item.unit_price;
        productSales.set(key, existing);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
      .map((p) => ({
        productName: p.product.name,
        quantitySold: p.quantity,
        revenue: p.revenue,
        revenueInBRL: p.revenue / 100,
      }));

    return {
      startDate,
      endDate,
      totalSales,
      totalRevenue,
      totalRevenueInBRL: totalRevenue / 100,
      averageSaleValue,
      averageSaleValueInBRL: averageSaleValue / 100,
      totalItemsSold,
      topSellingProducts: topProducts,
    };
  }

  async getProductSalesHistory(
    productId: string,
    limit: number = 50,
  ): Promise<ProductSalesDto[]> {
    const saleItems = await this.saleItemRepository.findByProductId(
      productId,
      limit,
    );

    return saleItems.map((item) => ({
      saleId: item.sale_id,
      saleDate: item.sale.sale_date,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      unitPriceInBRL: item.unit_price / 100,
      lineTotal: item.quantity * item.unit_price,
      lineTotalInBRL: (item.quantity * item.unit_price) / 100,
      userId: item.sale.user_id,
      userName: item.sale.user.name,
    }));
  }

  async getUserSalesHistory(
    userId: string,
    limit: number = 50,
  ): Promise<Sale[]> {
    return this.saleRepository.findByUserId(userId, limit);
  }

  private async createSaleInTransaction(
    userId: string,
    manager: EntityManager,
  ): Promise<Sale> {
    const saleRepo = manager.getRepository(Sale);
    const sale = saleRepo.create({
      user_id: userId,
      sale_date: new Date(),
      total_value: 0,
    });
    return saleRepo.save(sale);
  }

  private async processSaleItems(
    items: CreateSaleItemDto[],
    saleId: string,
    manager: EntityManager,
  ): Promise<SaleItem[]> {
    const saleItemRepo = manager.getRepository(SaleItem);
    const processedItems: SaleItem[] = [];
    const stocksToCheckForRemoval: string[] = [];

    for (const item of items) {
      const product = await this.productService.findOne(item.productId);

      const stock = await this.stockService.findByIdWithProduct(item.stockId);
      if (!stock) {
        throw new NotFoundException(`Stock with ID ${item.stockId} not found`);
      }

      const sellingPrice = stock.hasAutomaticDiscount
        ? stock.calculateSellingPriceWithDiscount(5) // Use configurable margin
        : product.baseSellingPrice;

      await this.stockService.decrementForSale(
        item.stockId,
        item.quantity,
        manager,
      );

      const saleItem = await saleItemRepo.save({
        sale_id: saleId,
        product_id: item.productId,
        stock_id: item.stockId,
        quantity: item.quantity,
        unit_price: sellingPrice,
      });

      processedItems.push(saleItem);
      stocksToCheckForRemoval.push(item.stockId);
    }

    // Remove depleted stocks after all sale items are saved
    for (const stockId of stocksToCheckForRemoval) {
      await this.stockService.removeIfDepleted(stockId, manager);
    }

    return processedItems;
  }

  private calculateSaleTotal(items: SaleItem[]): number {
    return items.reduce(
      (total, item) => total + item.quantity * item.unit_price,
      0,
    );
  }
}
