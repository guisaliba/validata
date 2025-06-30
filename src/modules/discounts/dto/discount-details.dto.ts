import { DiscountUrgency } from '../enums/discount-urgency';
import { DiscountType } from '../enums/discount-type';

export class DiscountDetailsDto {
  discountPercentage: number;
  basePrice: number;
  sellingPrice: number;
  savings: number;
  reason: string;
  urgency: DiscountUrgency;
  discountType: DiscountType;
}
