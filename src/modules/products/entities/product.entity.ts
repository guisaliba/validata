import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Stock } from '../../stocks/entities/stock.entity';
import { SaleItem } from '../../sales/entities/sale-item.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

@Entity()
@Index(['barcode'])
@Index(['category'])
@Index(['brand'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  barcode: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  brand: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  category: string;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  cost_price?: number;

  // KEPT: base_price field for storage (auto-updated)
  @Column('int', { default: 0 })
  @IsNumber()
  @IsOptional()
  base_price: number;

  @Column('float', { default: 0 })
  @IsNumber()
  @IsOptional()
  sales_frequency: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  min_stock_level?: number;

  @OneToMany(() => Stock, (stock) => stock.product, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  stocks: Stock[];

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product, {
    onDelete: 'RESTRICT',
  })
  saleItems: SaleItem[];

  @OneToOne(() => Discount, (discount) => discount.product, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  discount: Discount;

  @BeforeInsert()
  @BeforeUpdate()
  updateBasePrice(): void {
    if (this.cost_price && this.cost_price > 0) {
      this.base_price = Math.round(this.cost_price * 1.5);
    } else {
      // Reset base_price if cost_price is invalid
      this.base_price = 0;
    }
  }

  get baseSellingPrice(): number {
    if (this.base_price && this.base_price > 0) {
      return this.base_price;
    }

    if (!this.cost_price || this.cost_price === 0) {
      throw new Error(
        `Cannot calculate base selling price for product ${this.name}: cost_price is required`,
      );
    }

    const calculatedPrice = Math.round(this.cost_price * 1.5);
    this.base_price = calculatedPrice;
    return calculatedPrice;
  }

  calculateMinimumAllowedPrice(profitMarginThreshold: number): number {
    if (!this.cost_price || this.cost_price === 0) {
      throw new Error(
        `Cannot calculate minimum price for product ${this.name}: cost_price is required`,
      );
    }

    if (profitMarginThreshold < 0 || profitMarginThreshold > 20) {
      throw new Error(
        `Profit margin threshold must be between 0% and 20%. Received: ${profitMarginThreshold}%`,
      );
    }

    const minimumPriceInCents =
      this.cost_price * (1 + profitMarginThreshold / 100);
    return Math.round(minimumPriceInCents);
  }

  calculateMaximumDiscountAmount(profitMarginThreshold: number): number {
    const basePrice = this.baseSellingPrice;
    const minimumPrice = this.calculateMinimumAllowedPrice(
      profitMarginThreshold,
    );
    return basePrice - minimumPrice;
  }

  calculateMaximumDiscountPercentage(profitMarginThreshold: number): number {
    const basePrice = this.baseSellingPrice;

    if (basePrice <= 0) {
      throw new Error(
        'Cannot calculate discount percentage: base price must be positive',
      );
    }

    const maxDiscountAmount = this.calculateMaximumDiscountAmount(
      profitMarginThreshold,
    );

    return (maxDiscountAmount / basePrice) * 100;
  }

  calculateDiscountedPrice(
    discountPercentage: number,
    profitMarginThreshold: number,
  ): number {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error(
        `Discount percentage must be between 0% and 100%. Received: ${discountPercentage}%`,
      );
    }

    const basePrice = this.baseSellingPrice;
    const minimumAllowedPrice = this.calculateMinimumAllowedPrice(
      profitMarginThreshold,
    );
    const discountedPrice = basePrice * (1 - discountPercentage / 100);

    if (discountedPrice < minimumAllowedPrice) {
      throw new Error(
        `Discount of ${discountPercentage}% would result in price below minimum profit margin threshold. ` +
          `Minimum allowed price: R$ ${(minimumAllowedPrice / 100).toFixed(2)}`,
      );
    }

    return Math.round(discountedPrice);
  }

  get baseSellingPriceInBRL(): number {
    return this.baseSellingPrice / 100;
  }

  getMinimumAllowedPriceInBRL(profitMarginThreshold: number): number {
    return this.calculateMinimumAllowedPrice(profitMarginThreshold) / 100;
  }

  get costPriceInBRL(): number | null {
    if (!this.cost_price) {
      return null;
    }

    return this.cost_price / 100;
  }

  get storedBasePriceInBRL(): number | null {
    if (!this.base_price || this.base_price <= 0) {
      return null;
    }

    return this.base_price / 100;
  }
}
