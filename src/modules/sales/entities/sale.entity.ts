import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { IsNumber, IsPositive, IsUUID, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { SaleItem } from './sale-item.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @Column('timestamp')
  sale_date: Date;

  @Column('int')
  @IsNumber()
  @IsPositive()
  total_value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, {
    cascade: ['remove'],
  })
  items: SaleItem[];

  @BeforeInsert()
  setSaleDate(): void {
    if (!this.sale_date) {
      this.sale_date = new Date();
    }
  }

  get totalValueInBRL(): number {
    return this.total_value / 100;
  }

  get isToday(): boolean {
    const today = new Date();
    const saleDate = new Date(this.sale_date);
    return (
      saleDate.getDate() === today.getDate() &&
      saleDate.getMonth() === today.getMonth() &&
      saleDate.getFullYear() === today.getFullYear()
    );
  }

  canBeModified(): boolean {
    return this.isToday;
  }

  recalculateTotal(): void {
    if (!this.items || this.items.length === 0) {
      this.total_value = 0;
      return;
    }
    this.total_value = this.items.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );
  }
}
