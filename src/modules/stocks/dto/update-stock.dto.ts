import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateStockDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsDateString()
  expiration_date?: string;
}
