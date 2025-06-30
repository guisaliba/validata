import type { StockForSaleDto } from 'src/modules/stocks/dto/stock-for-sale.dto';

export class BarcodeScanResponseDto {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  basePrice: number;
  basePriceInBRL: number;
  availableStocks: StockForSaleDto[];
  hasDiscounts: boolean;
  lowestPrice?: number;
  lowestPriceInBRL?: number;
}
