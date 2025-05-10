import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Discount {
  @PrimaryColumn()
  product_id: string;

  @Column('date')
  expiration_date: Date;

  @Column('float')
  sales_frequency: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
