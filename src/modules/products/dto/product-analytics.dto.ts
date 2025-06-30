export class ProductAnalyticsDto {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  totalStockBatches: number;
  averageStockAge: number;
  stockTurnoverRate: number;
  salesFrequency: number;
  categoryProductCount: number;
  brandProductCount: number;
  createdAt: Date;
  lastUpdated: Date;
}
