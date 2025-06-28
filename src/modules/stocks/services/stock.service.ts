import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Stock } from '../entities/stock.entity';
import { StockRepository } from '../repositories/stock.repository';
import type { UpdateStockDto } from '../dto/update-stock.dto';
import type { IStockService } from '../interfaces/stock.interface';
import type { CreateStockDto } from '../dto/create-stock.dto';

@Injectable()
export class StockService implements IStockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockRepository.create(createStockDto);
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.findAll();
  }

  async findAvailableByProduct(productId: string): Promise<Stock[]> {
    return this.stockRepository.findAllAvailableByProduct(productId);
  }

  async findByProduct(productId: string): Promise<Stock[]> {
    return this.stockRepository.findAllByProduct(productId);
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found.`);
    }
    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    const updated = await this.stockRepository.update(id, updateStockDto);
    if (!updated) {
      throw new NotFoundException(`Stock with ID ${id} not found.`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }

  async decrementForSale(
    stockId: string,
    quantityToDecrement: number,
  ): Promise<Stock | null> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
    if (stock.quantity < quantityToDecrement) {
      throw new BadRequestException(
        `Insufficient stock for ID ${stockId}. Available: ${stock.quantity}, Requested: ${quantityToDecrement}`,
      );
    }
    // Now safe to decrement
    return this.stockRepository.decrementForSale(stockId, quantityToDecrement);
  }

  async removeIfDepleted(stockId: string): Promise<void> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
    if (stock.quantity > 0) {
      return;
    }
    await this.stockRepository.removeIfDepleted(stockId);
  }
}
