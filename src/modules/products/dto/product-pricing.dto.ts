export class ProductPricingDto {
  productId: string;
  productName: string;
  costPrice: number;
  basePrice: number;
  minimumPrice: number;
  currentLowestPrice: number;
  maxDiscountAmount: number;
  maxDiscountPercentage: number;
  hasDiscountedStock: boolean;
  costPriceInBRL: number;
  basePriceInBRL: number;
  minimumPriceInBRL: number;
  currentLowestPriceInBRL: number;
}
