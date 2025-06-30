import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Stock } from '../entities/stock.entity';
import { StockRepository } from '../repositories/stock.repository';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { IStockService } from '../interfaces/stock.interface';
import type { CreateStockDto } from '../dto/create-stock.dto';
import { DiscountUrgency } from '../../discounts/enums/discount-urgency';
import { DiscountType } from '../../discounts/enums/discount-type';
import { DiscountDetailsDto } from '../../discounts/dto/discount-details.dto';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StockService implements IStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockRepository.create(createStockDto);
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.findAll();
  }

  async findAllAvailableByProduct(productId: string): Promise<Stock[]> {
    return this.stockRepository.findAllAvailableByProduct(productId);
  }

  async findAllByProduct(productId: string): Promise<Stock[]> {
    return this.stockRepository.findAllByProduct(productId);
  }

  async findById(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found.`);
    }

    return stock;
  }

  async findByIdWithProduct(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findByIdWithProduct(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found.`);
    }

    return stock;
  }

  async findExpired(): Promise<Stock[]> {
    return this.stockRepository.findExpired();
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    const updated = await this.stockRepository.update(id, updateStockDto);
    if (!updated) {
      throw new NotFoundException(`Stock with ID ${id} not found.`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const stock = await this.findById(id);
    await this.stockRepository.remove(stock);
  }

  async decrementForSale(
    stockId: string,
    quantityToDecrement: number,
    manager?: EntityManager, // Optional transaction manager
  ): Promise<Stock> {
    // Use repository's transaction-aware method
    const stock = await this.stockRepository.findByIdWithManager(
      stockId,
      manager,
    );
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }

    if (stock.quantity < quantityToDecrement) {
      throw new BadRequestException(
        `Insufficient stock for ID ${stockId}. Available: ${stock.quantity}, Requested: ${quantityToDecrement}`,
      );
    }

    stock.quantity -= quantityToDecrement;

    // Use repository's transaction-aware save method
    return this.stockRepository.saveWithManager(stock, manager);
  }

  async removeIfDepleted(
    stockId: string,
    manager?: EntityManager,
  ): Promise<void> {
    const stock = await this.stockRepository.findByIdWithManager(
      stockId,
      manager,
    );
    if (stock && stock.quantity <= 0) {
      await this.stockRepository.removeWithManager(stock, manager);
    }
  }

  async getDiscountDetails(
    stockId: string,
    profitMarginThreshold: number,
  ): Promise<DiscountDetailsDto | null> {
    const stock = await this.stockRepository.findByIdWithProduct(stockId); // Load with product
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }

    const urgency = stock.discountUrgency;

    if (!urgency || !stock.product) {
      return null;
    }

    const basePrice = stock.product.baseSellingPrice;
    const sellingPrice = stock.calculateSellingPriceWithDiscount(
      profitMarginThreshold,
    );
    const savings = basePrice - sellingPrice;

    if (savings <= 0) {
      return null;
    }

    if (stock.shouldUseMinimumProfitPrice) {
      const effectiveDiscountPercentage = Math.round(
        (savings / basePrice) * 100,
      );

      return {
        discountPercentage: effectiveDiscountPercentage,
        basePrice,
        sellingPrice,
        savings,
        reason: 'Minimum profit margin pricing (expires today)',
        urgency,
        discountType: DiscountType.MINIMUM_PROFIT,
      };
    }

    const discountPercentage = stock.automaticDiscountPercentage;
    const reason = this.getDiscountReason(discountPercentage);

    return {
      discountPercentage,
      basePrice,
      sellingPrice,
      savings,
      reason,
      urgency,
      discountType: DiscountType.PERCENTAGE,
    };
  }

  private getDiscountReason(discountPercentage: number): string {
    const discountConfig: Record<number, string> = {
      15: 'Expires within 5 days',
      10: 'Expires within 10 days',
      5: 'Expires within 15 days',
    };

    return discountConfig[discountPercentage] || 'Expiration discount';
  }

  async findExpiringSoon(daysThreshold: number = 7): Promise<Stock[]> {
    return this.stockRepository.findExpiringSoon(daysThreshold);
  }

  async getLowestPriceForProduct(
    productId: string,
    profitMarginThreshold: number,
  ): Promise<number> {
    const stocks =
      await this.stockRepository.findAllAvailableByProduct(productId);
    const discountedStocks = stocks.filter(
      (stock) => stock.hasAutomaticDiscount,
    );

    if (discountedStocks.length === 0) {
      // No discounted stocks, return base price of first available stock
      if (stocks.length > 0 && stocks[0].product) {
        return stocks[0].product.baseSellingPrice;
      }
      throw new NotFoundException(
        `No available stocks found for product ${productId}`,
      );
    }

    const prices = discountedStocks.map((stock) =>
      stock.calculateSellingPriceWithDiscount(profitMarginThreshold),
    );

    return Math.min(...prices);
  }

  async getMostUrgentStockForProduct(productId: string): Promise<Stock | null> {
    const stocks =
      await this.stockRepository.findAllAvailableByProduct(productId);
    const urgentStocks = stocks.filter(
      (stock) => stock.discountUrgency === DiscountUrgency.ULTRA,
    );

    if (urgentStocks.length === 0) {
      return null;
    }

    return urgentStocks.sort(
      (a, b) => a.expiration_date.getTime() - b.expiration_date.getTime(),
    )[0];
  }

  async getStockSummaryForProduct(productId: string): Promise<{
    total: number;
    available: number;
    expired: number;
    expiring: number;
    fresh: number;
    hasDiscounts: boolean;
  }> {
    const allStocks = await this.stockRepository.findAllByProduct(productId);
    const availableStocks = allStocks.filter((stock) => stock.hasQuantity);
    const expiredStocks = allStocks.filter((stock) => stock.isExpired);
    const expiringStocks = availableStocks.filter(
      (stock) => stock.hasAutomaticDiscount,
    );
    const freshStocks = availableStocks.length - expiringStocks.length;

    return {
      total: allStocks.length,
      available: availableStocks.length,
      expired: expiredStocks.length,
      expiring: expiringStocks.length,
      fresh: freshStocks,
      hasDiscounts: expiringStocks.length > 0,
    };
  }
}
