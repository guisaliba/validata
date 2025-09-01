import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  DataSource,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  type EntityManager,
} from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { BaseRepository } from 'src/common/base-repository';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { IStockRepository } from '../interfaces/stock.interface';
import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';

@Injectable({ scope: Scope.REQUEST })
export class StockRepository
  extends BaseRepository
  implements IStockRepository
{
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(stockData: CreateStockDto): Promise<Stock> {
    const repo = this.getRepository(Stock);
    const stock = repo.create({
      product_id: stockData.productId,
      quantity: stockData.quantity,
      expiration_date: stockData.expiration_date
        ? new Date(stockData.expiration_date)
        : undefined,
    });

    return repo.save(stock);
  }

  async findAll(): Promise<Stock[]> {
    return this.getRepository(Stock).find({
      relations: ['product'],
    });
  }

  async findAllAvailableByProduct(productId: string): Promise<Stock[]> {
    return this.getRepository(Stock).find({
      where: {
        product_id: productId,
        quantity: MoreThan(0),
      },
      order: {
        expiration_date: 'ASC',
      },
      relations: ['product'],
    });
  }

  async findAllByProduct(productId: string): Promise<Stock[]> {
    return this.getRepository(Stock).find({
      where: { product_id: productId },
      order: { expiration_date: 'ASC' },
      relations: ['product'],
    });
  }

  async findById(id: string): Promise<Stock | null> {
    return this.getRepository(Stock).findOneBy({ id });
  }

  async findByIdWithProduct(id: string): Promise<Stock | null> {
    return this.getRepository(Stock).findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findExpiringSoon(daysThreshold: number): Promise<Stock[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.getRepository(Stock).find({
      where: {
        expiration_date: LessThanOrEqual(thresholdDate),
        quantity: MoreThan(0),
      },
      order: {
        expiration_date: 'ASC',
      },
      relations: ['product'],
    });
  }

  async findExpired(): Promise<Stock[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.getRepository(Stock).find({
      where: {
        expiration_date: LessThan(today),
      },
      order: {
        expiration_date: 'ASC',
      },
      relations: ['product'],
    });
  }

  async findAllWithProducts(): Promise<Stock[]> {
    return this.getRepository(Stock).find({
      relations: ['product'],
      order: {
        expiration_date: 'ASC',
      },
    });
  }

  async update(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Stock | null> {
    const repo = this.getRepository(Stock);
    const stockToUpdate = await repo.preload({
      id,
      ...updateStockDto,
      expiration_date: updateStockDto.expiration_date
        ? new Date(updateStockDto.expiration_date)
        : undefined,
    });

    if (!stockToUpdate) {
      return null;
    }

    return repo.save(stockToUpdate);
  }

  async save(stock: Stock): Promise<Stock> {
    return this.getRepository(Stock).save(stock);
  }

  async remove(stock: Stock): Promise<void> {
    await this.getRepository(Stock).remove(stock);
  }

  async findByIdWithManager(
    id: string,
    manager?: EntityManager,
  ): Promise<Stock | null> {
    const repo = manager
      ? manager.getRepository(Stock)
      : this.getRepository(Stock);
    return repo.findOneBy({ id });
  }

  async saveWithManager(stock: Stock, manager?: EntityManager): Promise<Stock> {
    const repo = manager
      ? manager.getRepository(Stock)
      : this.getRepository(Stock);
    return repo.save(stock);
  }

  async removeWithManager(
    stock: Stock,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(Stock)
      : this.getRepository(Stock);
    await repo.remove(stock);
  }
}
