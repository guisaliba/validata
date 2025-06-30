import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ExpirationStatus } from '../enums/expiration-status';
import { DiscountUrgency } from '../../discounts/enums/discount-urgency';
import { SaleItem } from 'src/modules/sales/entities/sale-item.entity';

@Entity()
@Index(['product_id'])
@Index(['expiration_date'])
@Index(['product_id', 'expiration_date'])
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ManyToOne(() => Product, (product) => product.stocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.stock)
  sale_items: SaleItem[];

  @Column('int')
  @IsNumber()
  @Min(0)
  quantity: number;

  @Column({ type: 'date' })
  @IsDate()
  expiration_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  get isExpired(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expirationDate = new Date(this.expiration_date);
    expirationDate.setHours(0, 0, 0, 0);

    return expirationDate < today;
  }

  isExpiringSoon(daysThreshold: number = 7): boolean {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    const expirationDate = new Date(this.expiration_date);

    return expirationDate <= thresholdDate && !this.isExpired;
  }

  get daysUntilExpiration(): number {
    if (!this.expiration_date) {
      throw new Error('Expiration date is required');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expirationDate = new Date(this.expiration_date);

    if (isNaN(expirationDate.getTime())) {
      throw new Error('Invalid expiration date');
    }

    expirationDate.setHours(0, 0, 0, 0);

    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get expirationStatus(): ExpirationStatus {
    if (this.isExpired) return ExpirationStatus.EXPIRED;
    if (this.isExpiringSoon()) return ExpirationStatus.EXPIRING_SOON;
    return ExpirationStatus.FRESH;
  }

  get hasQuantity(): boolean {
    return this.quantity > 0;
  }

  get isDepleted(): boolean {
    return this.quantity <= 0;
  }

  get formattedExpirationDate(): string {
    return this.expiration_date.toLocaleDateString('pt-BR');
  }

  get expirationWarning(): string | null {
    const days = this.daysUntilExpiration;

    if (days < 0) {
      return `Expired ${Math.abs(days)} day(s) ago`;
    } else if (days === 0) {
      return 'Expires today';
    } else if (days <= 7) {
      return `Expires in ${days} day(s)`;
    }

    return null;
  }

  get automaticDiscountPercentage(): number {
    const days = this.daysUntilExpiration;

    if (days <= 1) {
      return 0; // Use minimum profit margin (protective threshold)
    } else if (days <= 3) {
      return 15; // 15% discount - expires within 5 days
    } else if (days <= 7) {
      return 10; // 10% discount - expires within 10 days
    } else if (days <= 15) {
      return 5; // 5% discount - expires within 15 days
    }

    return 0; // No discount for fresh products
  }

  get shouldUseMinimumProfitPrice(): boolean {
    const days = this.daysUntilExpiration;
    return days <= 1;
  }

  get discountUrgency(): DiscountUrgency | null {
    const days = this.daysUntilExpiration;

    if (days <= 1) {
      return DiscountUrgency.ULTRA;
    } else if (days <= 3) {
      return DiscountUrgency.HIGH;
    } else if (days <= 7) {
      return DiscountUrgency.MEDIUM;
    } else if (days <= 15) {
      return DiscountUrgency.LOW;
    }

    return null;
  }

  get hasAutomaticDiscount(): boolean {
    return (
      this.automaticDiscountPercentage > 0 || this.shouldUseMinimumProfitPrice
    );
  }

  calculateSellingPriceWithDiscount(profitMarginThreshold: number): number {
    if (!this.product) {
      throw new Error('Product must be loaded to calculate selling price');
    }

    const basePrice = this.product.baseSellingPrice;
    const minimumAllowedPrice = this.product.calculateMinimumAllowedPrice(
      profitMarginThreshold,
    );

    // Only products expiring ≤1 day use minimum profit margin price
    if (this.shouldUseMinimumProfitPrice) {
      return minimumAllowedPrice;
    }

    const discountPercentage = this.automaticDiscountPercentage;

    if (discountPercentage === 0) {
      return basePrice;
    }

    const discountedPrice = basePrice * (1 - discountPercentage / 100);

    if (discountedPrice < minimumAllowedPrice) {
      return minimumAllowedPrice;
    }

    return Math.round(discountedPrice);
  }
}
