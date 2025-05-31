import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { SalesAnalysis } from './sales-analysis.entity';

@Entity()
export class SalesAnalysisProduct {
  @PrimaryColumn()
  analysis_id: string;

  @PrimaryColumn()
  product_id: string;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => SalesAnalysis)
  @JoinColumn({ name: 'analysis_id' })
  analysis: SalesAnalysis;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
