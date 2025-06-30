import { SaleItem } from '../entities/sale-item.entity';

export interface ISaleItemRepository {
  findById(id: string): Promise<SaleItem | null>;
  findBySaleId(saleId: string): Promise<SaleItem[]>;
  remove(saleItem: SaleItem): Promise<void>;
  findByProductId(productId: string, limit?: number): Promise<SaleItem[]>;
  getProductSalesStats(productId: string): Promise<{
    totalQuantitySold: number;
    totalRevenue: number;
    averagePrice: number;
    salesCount: number;
  }>;
  findTopSellingProducts(limit?: number): Promise<
    Array<{
      productId: string;
      productName: string;
      totalQuantitySold: number;
      totalRevenue: number;
    }>
  >;
}
