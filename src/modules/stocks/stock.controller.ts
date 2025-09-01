import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Stock } from './entities/stock.entity';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockSummaryDto } from './dto/stock-summary.dto';
import { DiscountDetailsDto } from '../discounts/dto/discount-details.dto';

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

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Stock> {
    return this.stockService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockService.remove(id);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Stock[]> {
    return this.stockService.findAllByProduct(productId);
  }

  @Get('product/:productId/available')
  findAllAvailable(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Stock[]> {
    return this.stockService.findAllAvailableByProduct(productId);
  }

  @Get('expiring/soon')
  findExpiringSoon(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ): Promise<Stock[]> {
    return this.stockService.findExpiringSoon(days);
  }

  @Get('expired')
  findExpired(): Promise<Stock[]> {
    return this.stockService.findExpired();
  }

  @Get(':id/discount-details')
  getDiscountDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('profitMarginThreshold', ParseIntPipe) profitMarginThreshold: number,
  ): Promise<DiscountDetailsDto | null> {
    return this.stockService.getDiscountDetails(id, profitMarginThreshold);
  }

  @Get('product/:productId/lowest-price')
  async getLowestPriceForProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('profitMarginThreshold', ParseIntPipe) profitMarginThreshold: number,
  ): Promise<{ lowestPrice: number; lowestPriceInBRL: number }> {
    const price = await this.stockService.getLowestPriceForProduct(
      productId,
      profitMarginThreshold,
    );
    return {
      lowestPrice: price,
      lowestPriceInBRL: price / 100,
    };
  }

  @Get('product/:productId/most-urgent')
  getMostUrgentStock(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Stock | null> {
    return this.stockService.getMostUrgentStockForProduct(productId);
  }

  @Get('product/:productId/summary')
  getStockSummary(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<StockSummaryDto> {
    return this.stockService.getStockSummaryForProduct(productId);
  }

  @Patch(':id/decrement')
  decrementStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { quantity: number },
  ): Promise<Stock> {
    return this.stockService.decrementForSale(id, body.quantity);
  }

  @Delete(':id/if-depleted')
  removeIfDepleted(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockService.removeIfDepleted(id);
  }
}
