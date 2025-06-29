import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const stock = repo.create({
      ...stockData,
      expiration_date: stockData.expiration_date
        ? new Date(stockData.expiration_date)
        : undefined,
    }) as Stock;

    return repo.save(stock);
  }

  async findAll() {
    return this.getRepository(Stock).find({
      relations: ['product'],
    });
  }

  async findAllAvailableByProduct(productId: string): Promise<Stock[]> {
    return this.getRepository(Stock).find({
      where: {
        productId,
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
      where: { productId },
      order: { expiration_date: 'ASC' },
      relations: ['product'],
    });
  }

  async findById(id: string): Promise<Stock | null> {
    return this.getRepository(Stock).findOneBy({ id });
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

  async remove(stock: Stock): Promise<void> {
    await this.getRepository(Stock).remove(stock);
  }

  async decrementForSale(
    stockId: string,
    quantityToDecrement: number,
  ): Promise<Stock | null> {
    const repo = this.getRepository(Stock);
    const stock = await repo.findOneBy({ id: stockId });
    if (!stock) {
      return null;
    }
    stock.quantity -= quantityToDecrement;
    return repo.save(stock);
  }

  async removeIfDepleted(stockId: string): Promise<boolean> {
    const repo = this.getRepository(Stock);
    const stock = await repo.findOneBy({ id: stockId });
    if (stock && stock.quantity <= 0) {
      await repo.remove(stock);
      return true;
    }
    return false;
  }
}
