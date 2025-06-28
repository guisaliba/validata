import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { Stock } from '../entities/stock.entity';

export interface IStockService {
  create(createStockDto: CreateStockDto): Promise<Stock>;
  findAll(): Promise<Stock[]>;
  findAvailableByProduct(productId: string): Promise<Stock[]>;
  findByProduct(productId: string): Promise<Stock[]>;
  findOne(id: string): Promise<Stock>;
  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock>;
  remove(id: string): Promise<void>;
}

export interface IStockRepository {
  findAll(): Promise<Stock[]>;
  findAllAvailableByProduct(productId: string): Promise<Stock[]>;
  findAllByProduct(productId: string): Promise<Stock[]>;
  findById(id: string): Promise<Stock | null>;
  create(stockData: CreateStockDto): Promise<Stock>;
  update(id: string, stockData: UpdateStockDto): Promise<Stock | null>;
  remove(stock: Stock): Promise<void>;
}
