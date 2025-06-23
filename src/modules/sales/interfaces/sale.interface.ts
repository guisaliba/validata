import type { CreateSaleDto } from '../dto/create-sale.dto';
import type { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(saleData: CreateSaleDto): Promise<Sale>;
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
  remove(sale: Sale): Promise<void>;
  findByIdWithRelations(id: string): Promise<Sale | null>;
}
