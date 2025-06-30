import type { TopSellingProductDto } from 'src/modules/products/dto/top-selling-product.dto';

export class SalesSummaryDto {
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalRevenue: number;
  totalRevenueInBRL: number;
  averageSaleValue: number;
  averageSaleValueInBRL: number;
  totalItemsSold: number;
  topSellingProducts: TopSellingProductDto[];
}
