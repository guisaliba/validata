export class StockForSaleDto {
  stockId: string;
  quantity: number;
  expirationDate: Date;
  daysUntilExpiration: number;
  sellingPrice: number;
  sellingPriceInBRL: number;
  hasDiscount: boolean;
  discountPercentage?: number;
  urgency?: string;
}
