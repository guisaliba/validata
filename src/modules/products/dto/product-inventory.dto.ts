export class ProductInventoryDto {
  productId: string;
  productName: string;
  totalStock: number;
  availableStock: number;
  expiredStock: number;
  expiringStock: number;
  isLowStock: boolean;
  minStockLevel: number;
  stockBatches: number;
}
