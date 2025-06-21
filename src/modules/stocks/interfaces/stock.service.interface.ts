import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { Stock } from '../entities/stock.entity';

export interface IStockService {
  create(createStockDto: CreateStockDto): Promise<Stock>;
  findAll(): Promise<Stock[]>;
  findOne(id: string): Promise<Stock>;
  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock>;
  remove(id: string): Promise<void>;
}
