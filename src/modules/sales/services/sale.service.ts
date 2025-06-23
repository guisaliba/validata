import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Sale } from '../entities/sale.entity';
import { StockService } from 'src/modules/stocks/services/stock.service';
import { SaleRepository } from '../repositories/sale.repository';
import { SaleItemRepository } from '../repositories/sale-item.repository';
import type { ProductRepository } from 'src/modules/products/repositories/product.repository';
import type { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly saleItemRepository: SaleItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly stockService: StockService,
  ) {}

  async findProductWithStockByBarcode(barcode: string) {
    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new NotFoundException(`Product with barcode ${barcode} not found.`);
    }
    const stocks = await this.stockService.findAvailableByProduct(product.id);
    return { ...product, stocks };
  }

  async createSale(createSaleDto: CreateSaleDto): Promise<Sale | null> {
    const { userId, items } = createSaleDto;

    // Validate user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const sale = await this.saleRepository.create(createSaleDto);

    for (const item of items) {
      const { productId, stockId, quantity } = item;

      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      // Decrement stock
      await this.stockService.decrementForSale(stockId, quantity);

      // Create sale item
      await this.saleItemRepository.create({
        saleId: sale.id,
        productId: product.id,
        stockId,
        quantity,
        unitPrice: product.base_price,
      });
    }

    // Return sale with relations if needed
    return await this.saleRepository.findByIdWithRelations(sale.id);
  }
}
