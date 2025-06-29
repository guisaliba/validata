import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SaleItem } from '../entities/sale-item.entity';
import { BaseRepository } from 'src/common/base-repository';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { CreateSaleItemDto } from '../dto/create-sale-item.dto';
import type { ISaleItemRepository } from '../interfaces/sale-item.interface';

@Injectable({ scope: Scope.REQUEST })
export class SaleItemRepository
  extends BaseRepository
  implements ISaleItemRepository
{
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(saleItemData: CreateSaleItemDto): Promise<SaleItem> {
    const repo = this.getRepository(SaleItem);

    const saleItem = repo.create(saleItemData);
    return repo.save(saleItem);
  }

  async findById(id: string): Promise<SaleItem | null> {
    return this.getRepository(SaleItem).findOneBy({ id });
  }

  async findBySaleId(saleId: string): Promise<SaleItem[]> {
    return this.getRepository(SaleItem).find({ where: { sale_id: saleId } });
  }

  async remove(saleItem: SaleItem): Promise<void> {
    await this.getRepository(SaleItem).remove(saleItem);
  }
}
