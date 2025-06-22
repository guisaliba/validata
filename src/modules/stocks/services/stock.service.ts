import { Injectable, NotFoundException } from '@nestjs/common';
import type { IStockService } from '../interfaces/stock.service.interface';
import { CreateStockDto } from '../dto/create-stock.dto';
import { Stock } from '../entities/stock.entity';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repositories/stock.repository';

@Injectable()
export class StockService implements IStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    return await this.stockRepository.create(createStockDto);
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockRepository.findAll();
  }

  async findAllAvailable(): Promise<Stock[]> {
    return this.stockRepository.findAllAvailable();
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return stock;
  }

  async findByProduct(productId: string): Promise<Stock[]> {
    return await this.stockRepository.findByProduct(productId);
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    await this.findOne(id);
    const updatedStock = await this.stockRepository.update(id, updateStockDto);
    if (!updatedStock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return updatedStock;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.stockRepository.delete(id);
  }
}
