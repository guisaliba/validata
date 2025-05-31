import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Stock } from '../../stocks/entities/stock.entity';
import { Batch } from '../../batches/entities/batch.entity';
import { SaleItem } from '../../sales/entities/sale-item.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { SalesAnalysisProduct } from '../../analysis/entities/sales-analysis-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('float')
  base_price: number;

  @Column('float')
  sales_frequency: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];

  @OneToMany(() => Batch, (batch) => batch.product)
  batches: Batch[];

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems: SaleItem[];

  @OneToOne(() => Discount, (discount) => discount.product)
  discount: Discount;

  @OneToMany(
    () => SalesAnalysisProduct,
    (analysisProduct) => analysisProduct.product,
  )
  analysisProducts: SalesAnalysisProduct[];
}
