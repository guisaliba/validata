import type { ProductForSalesAnalytics } from './product-for-sales-analytics.interface';

export interface ProductSalesData {
  product: ProductForSalesAnalytics;
  quantity: number;
  revenue: number;
}
