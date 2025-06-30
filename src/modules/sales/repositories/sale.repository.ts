import { Injectable, Scope, Inject } from '@nestjs/common';
import { DataSource, Between } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Sale } from '../entities/sale.entity';
import { BaseRepository } from '../../../common/base-repository';
import { ISaleRepository } from '../interfaces/sale.interface';

@Injectable({ scope: Scope.REQUEST })
export class SaleRepository extends BaseRepository implements ISaleRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findAll(): Promise<Sale[]> {
    return this.getRepository(Sale).find({
      relations: ['user', 'items', 'items.product'],
      order: { sale_date: 'DESC' },
    });
  }

  async findById(id: string): Promise<Sale | null> {
    return this.getRepository(Sale).findOneBy({ id });
  }

  async findByIdWithRelations(id: string): Promise<Sale | null> {
    return this.getRepository(Sale).findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async remove(sale: Sale): Promise<void> {
    await this.getRepository(Sale).remove(sale);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.getRepository(Sale).find({
      where: {
        sale_date: Between(startDate, endDate),
      },
      relations: ['user', 'items', 'items.product'],
      order: { sale_date: 'DESC' },
    });
  }

  async findByUserId(userId: string, limit: number = 50): Promise<Sale[]> {
    return this.getRepository(Sale).find({
      where: { user_id: userId },
      relations: ['items', 'items.product'],
      order: { sale_date: 'DESC' },
      take: limit,
    });
  }

  async findTodaysSales(): Promise<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findByDateRange(today, tomorrow);
  }

  async findTopSellingPeriod(
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ): Promise<Sale[]> {
    return this.getRepository(Sale).find({
      where: {
        sale_date: Between(startDate, endDate),
      },
      relations: ['user', 'items', 'items.product'],
      order: { total_value: 'DESC' },
      take: limit,
    });
  }
}
