import type { ProductBreakdownDto } from '../../products/dto/product-breakdown-dto';

export class SaleAnalyticsDto {
  saleId: string;
  userId: string;
  userName: string;
  saleDate: Date;
  totalValue: number;
  totalValueInBRL: number;
  totalItems: number;
  uniqueProducts: number;
  averageItemPrice: number;
  averageItemPriceInBRL: number;
  productBreakdown: ProductBreakdownDto[];
}
