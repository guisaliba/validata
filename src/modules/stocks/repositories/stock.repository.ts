import { Injectable } from '@nestjs/common';
import type { IStockRepository } from '../interfaces/stock.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from '../entities/stock.entity';
import { MoreThan, type Repository } from 'typeorm';
import type { CreateStockDto } from '../dto/create-stock.dto';
import type { UpdateStockDto } from '../dto/update-stock.dto';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repository: Repository<Stock>,
  ) {}

  async findById(id: string): Promise<Stock | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Stock[]> {
    return this.repository.find();
  }

  async findAllAvailable(): Promise<Stock[]> {
    return this.repository.find({ where: { quantity: MoreThan(0) } });
  }

  async create(stockData: CreateStockDto): Promise<Stock> {
    const stock = this.repository.create(stockData);

    return this.repository.save(stock);
  }

  async update(id: string, stockData: UpdateStockDto): Promise<Stock | null> {
    await this.repository.update(id, stockData);

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
