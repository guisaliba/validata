export class ProductSalesStatsDto {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalRevenueInBRL: number;
  averagePrice: number;
  averagePriceInBRL: number;
  salesCount: number;
  firstSaleDate?: Date;
  lastSaleDate?: Date;
}
