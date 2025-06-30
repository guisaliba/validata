import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsString()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @IsPositive()
  base_price: number;

  @IsNumber()
  @Min(0)
  @IsPositive()
  cost_price: number;
}
