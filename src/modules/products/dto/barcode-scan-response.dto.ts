import type { StockForSaleDto } from '../../stocks/dto/stock-for-sale.dto';

export class BarcodeScanResponseDto {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  costPrice: number;
  costPriceInBRL: number;
  basePrice: number;
  basePriceInBRL: number;
  availableStocks: StockForSaleDto[];
  hasDiscounts: boolean;
  lowestPrice?: number;
  lowestPriceInBRL?: number;
}
