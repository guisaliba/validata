import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Sale } from './sale.entity';
import { Stock } from '../../stocks/entities/stock.entity';
import { IsUUID, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsUUID()
  @IsNotEmpty()
  sale_id: string;

  @Column()
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @Column()
  @IsUUID()
  @IsNotEmpty()
  stock_id: string;

  @Column('int')
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @Column('int')
  @IsNumber()
  @IsPositive()
  @Min(1)
  unit_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.sale_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Stock, (stock) => stock.sale_items)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @BeforeInsert()
  @BeforeUpdate()
  validateSaleItem(): void {
    if (this.quantity <= 0) {
      throw new Error('Sale item quantity must be greater than 0');
    }
    if (this.unit_price <= 0) {
      throw new Error('Sale item unit price must be greater than 0');
    }
  }

  get lineTotal(): number {
    return this.quantity * this.unit_price;
  }

  get lineTotalInBRL(): number {
    return this.lineTotal / 100;
  }

  get unitPriceInBRL(): number {
    return this.unit_price / 100;
  }

  calculateDiscountFromBasePrice(basePrice: number): number {
    if (basePrice <= this.unit_price) return 0;
    return basePrice - this.unit_price;
  }

  hasDiscountFromBasePrice(basePrice: number): boolean {
    return this.calculateDiscountFromBasePrice(basePrice) > 0;
  }
}
