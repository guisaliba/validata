import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductService } from './interfaces/product.interface';
import { ProductRepository } from './product.repository';
import type { ProductAnalyticsDto } from './dto/product-analytics.dto';
import type { ProductPricingDto } from './dto/product-pricing.dto';
import type { ProductInventoryDto } from './dto/product-inventory.dto';
import type { Stock } from '../stocks/entities/stock.entity';

@Injectable()
export class ProductService implements IProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new NotFoundException(`Product with barcode ${barcode} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);
    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.productRepository.delete(id);
  }

  async getProductWithStocks(id: string): Promise<Product> {
    const product = await this.productRepository.findByIdWithStocks(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getProductInventory(id: string): Promise<ProductInventoryDto> {
    const product = await this.productRepository.findByIdWithStocks(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const totalStock = product.stocks.reduce(
      (sum, stock) => sum + stock.quantity,
      0,
    );
    const availableStock = product.stocks
      .filter((stock) => stock.hasQuantity && !stock.isExpired)
      .reduce((sum, stock) => sum + stock.quantity, 0);
    const expiredStock = product.stocks
      .filter((stock) => stock.isExpired)
      .reduce((sum, stock) => sum + stock.quantity, 0);
    const expiringStock = product.stocks
      .filter((stock) => stock.hasAutomaticDiscount && !stock.isExpired)
      .reduce((sum, stock) => sum + stock.quantity, 0);

    const isLowStock = product.min_stock_level
      ? availableStock <= product.min_stock_level
      : false;

    return {
      productId: product.id,
      productName: product.name,
      totalStock,
      availableStock,
      expiredStock,
      expiringStock,
      isLowStock,
      minStockLevel: product.min_stock_level || 0,
      stockBatches: product.stocks.length,
    };
  }

  async getProductPricing(
    id: string,
    profitMarginThreshold: number,
  ): Promise<ProductPricingDto> {
    const product = await this.productRepository.findByIdWithStocks(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (!product.cost_price || product.cost_price <= 0) {
      throw new BadRequestException(
        `Product ${product.name} has no valid cost price set`,
      );
    }

    const basePrice = product.baseSellingPrice;
    const minimumPrice = product.calculateMinimumAllowedPrice(
      profitMarginThreshold,
    );
    const maxDiscountAmount = product.calculateMaximumDiscountAmount(
      profitMarginThreshold,
    );
    const maxDiscountPercentage = product.calculateMaximumDiscountPercentage(
      profitMarginThreshold,
    );

    const availableStocks = product.stocks.filter(
      (stock) => stock.hasQuantity && !stock.isExpired,
    );

    let currentLowestPrice = basePrice;
    let hasDiscountedStock = false;

    if (availableStocks.length > 0) {
      const discountedStocks = availableStocks.filter(
        (stock) => stock.hasAutomaticDiscount,
      );
      if (discountedStocks.length > 0) {
        hasDiscountedStock = true;
        const prices = discountedStocks.map((stock) =>
          stock.calculateSellingPriceWithDiscount(profitMarginThreshold),
        );
        currentLowestPrice = Math.min(...prices);
      }
    }

    return {
      productId: product.id,
      productName: product.name,
      costPrice: product.cost_price,
      basePrice,
      minimumPrice,
      currentLowestPrice,
      maxDiscountAmount,
      maxDiscountPercentage: Math.round(maxDiscountPercentage * 100) / 100,
      hasDiscountedStock,
      costPriceInBRL: product.costPriceInBRL,
      basePriceInBRL: product.baseSellingPriceInBRL,
      minimumPriceInBRL: product.getMinimumAllowedPriceInBRL(
        profitMarginThreshold,
      ),
      currentLowestPriceInBRL: currentLowestPrice / 100,
    };
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productRepository.searchProducts(query);
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  async findByBrand(brand: string): Promise<Product[]> {
    return this.productRepository.findByBrand(brand);
  }

  async getProductAnalytics(id: string): Promise<ProductAnalyticsDto> {
    const product = await this.productRepository.findByIdWithStocks(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const totalStockBatches = product.stocks.length;
    const averageStockAge = this.calculateAverageStockAge(product.stocks);
    const stockTurnoverRate = product.sales_frequency || 0;

    const categoryProducts = await this.productRepository.findByCategory(
      product.category,
    );
    const brandProducts = await this.productRepository.findByBrand(
      product.brand,
    );

    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      brand: product.brand,
      totalStockBatches,
      averageStockAge,
      stockTurnoverRate,
      salesFrequency: product.sales_frequency,
      categoryProductCount: categoryProducts.length,
      brandProductCount: brandProducts.length,
      createdAt: product.created_at,
      lastUpdated: product.updated_at,
    };
  }

  async updateCostPrice(id: string, newCostPrice: number): Promise<Product> {
    if (newCostPrice <= 0) {
      throw new BadRequestException('Cost price must be greater than 0');
    }

    return this.update(id, { cost_price: newCostPrice });
  }

  async bulkUpdateCostPrices(
    updates: Array<{ id: string; cost_price: number }>,
  ): Promise<Product[]> {
    const results: Product[] = [];

    for (const update of updates) {
      try {
        const product = await this.updateCostPrice(
          update.id,
          update.cost_price,
        );
        results.push(product);
      } catch (error) {
        console.error(
          `Failed to update cost price for product ${update.id}:`,
          error,
        );
      }
    }

    return results;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.productRepository.findLowStockProducts();
  }

  async getProductsWithoutCostPrice(): Promise<Product[]> {
    return this.productRepository.findProductsWithoutCostPrice();
  }

  private calculateAverageStockAge(stocks: Stock[]): number {
    if (stocks.length === 0) return 0;

    const today = new Date();
    const totalAge = stocks.reduce((sum, stock) => {
      const stockAge = Math.floor(
        (today.getTime() - new Date(stock.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return sum + stockAge;
    }, 0);

    return Math.round(totalAge / stocks.length);
  }
}
