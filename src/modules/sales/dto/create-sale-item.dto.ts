import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  saleId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  stockId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  unitPrice: number;
}
