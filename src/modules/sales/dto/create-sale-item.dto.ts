import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  stockId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
