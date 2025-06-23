import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { BaseRepository } from 'src/common/base-repository';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { ISaleRepository } from '../interfaces/sale.interface';
import type { CreateSaleDto } from '../dto/create-sale.dto';

@Injectable({ scope: Scope.REQUEST })
export class SaleRepository extends BaseRepository implements ISaleRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(saleData: CreateSaleDto): Promise<Sale> {
    const repo = this.getRepository(Sale);
    const sale = repo.create(saleData);

    return repo.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.getRepository(Sale).find();
  }

  async findById(id: string): Promise<Sale | null> {
    return this.getRepository(Sale).findOneBy({ id });
  }

  async remove(sale: Sale): Promise<void> {
    await this.getRepository(Sale).remove(sale);
  }

  async findByIdWithRelations(id: string): Promise<Sale | null> {
    return this.getRepository(Sale).findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }
}
