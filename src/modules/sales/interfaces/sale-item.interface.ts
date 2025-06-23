import type { SaleItem } from '../entities/sale-item.entity';
import type { CreateSaleItemDto } from '../dto/create-sale-item.dto';

export interface ISaleItemRepository {
  create(saleItemData: CreateSaleItemDto): Promise<SaleItem>;
  findById(id: string): Promise<SaleItem | null>;
  findBySaleId(saleId: string): Promise<SaleItem[]>;
  remove(saleItem: SaleItem): Promise<void>;
}
