import type { DiscountDetailsDto } from 'src/modules/discounts/dto/discount-details.dto';
import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { Stock } from '../entities/stock.entity';
import type { StockSummaryDto } from '../dto/stock-summary.dto';

export interface IStockService {
  findAll(): Promise<Stock[]>;
  findAllAvailableByProduct(productId: string): Promise<Stock[]>;
  findAllByProduct(productId: string): Promise<Stock[]>;
  findById(id: string): Promise<Stock>;
  findExpired(): Promise<Stock[]>;
  create(createStockDto: CreateStockDto): Promise<Stock>;
  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock>;
  remove(id: string): Promise<void>;
  decrementForSale(
    stockId: string,
    quantityToDecrement: number,
  ): Promise<Stock>;
  removeIfDepleted(stockId: string): Promise<void>;
  getDiscountDetails(
    stockId: string,
    profitMarginThreshold: number,
  ): Promise<DiscountDetailsDto | null>;
  findExpiringSoon(daysThreshold?: number): Promise<Stock[]>;
  getLowestPriceForProduct(
    productId: string,
    profitMarginThreshold: number,
  ): Promise<number>;
  getMostUrgentStockForProduct(productId: string): Promise<Stock | null>;
  getStockSummaryForProduct(productId: string): Promise<StockSummaryDto>;
}

export interface IStockRepository {
  findAll(): Promise<Stock[]>;
  findAllAvailableByProduct(productId: string): Promise<Stock[]>;
  findAllByProduct(productId: string): Promise<Stock[]>;
  findById(id: string): Promise<Stock | null>;
  findByIdWithProduct(id: string): Promise<Stock | null>;
  findExpiringSoon(daysThreshold: number): Promise<Stock[]>;
  findExpired(): Promise<Stock[]>;
  findAllWithProducts(): Promise<Stock[]>;
  create(stockData: CreateStockDto): Promise<Stock>;
  update(id: string, stockData: UpdateStockDto): Promise<Stock | null>;
  remove(stock: Stock): Promise<void>;
  save(stock: Stock): Promise<Stock>;
}
