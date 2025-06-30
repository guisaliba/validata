import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateStockDto {
  @IsUUID()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  expiration_date: string;
}
