import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SalesAnalysisProduct } from './sales-analysis-product.entity';

@Entity()
export class SalesAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  period: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => SalesAnalysisProduct,
    (analysisProduct) => analysisProduct.analysis,
  )
  products: SalesAnalysisProduct[];
}
