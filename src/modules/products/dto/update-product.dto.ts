import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class BulkCostUpdateDto {
  updates: Array<{
    id: string;
    cost_price: number;
  }>;
}
