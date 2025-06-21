import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import type { CreateStockDto } from '../dto/create-stock.dto';
import type { Stock } from '../entities/stock.entity';
import type { StockService } from '../services/stock.service';
import type { UpdateStockDto } from '../dto/update-stock.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Get('available')
  findAllAvailable(): Promise<Stock[]> {
    return this.stockService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Stock> {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.stockService.remove(id);
  }
}
