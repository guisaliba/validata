import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { Stock } from '../entities/stock.entity';

export interface IStockRepository {
  findById(id: string): Promise<Stock | null>;
  findAll(): Promise<Stock[]>;
  findAllAvailable(): Promise<Stock[]>;
  create(stockData: CreateStockDto): Promise<Stock>;
  update(id: string, stockData: UpdateStockDto): Promise<Stock | null>;
  delete(id: string): Promise<void>;
}
