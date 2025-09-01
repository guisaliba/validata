import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { SaleService } from '../services/sale.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleAnalyticsDto } from '../dto/sale-analytics-dto';
import { SalesSummaryDto } from '../dto/sales-summary.dto';
import { ProductSalesDto } from '../dto/product-sales.dto';
import { BarcodeScanResponseDto } from '../../products/dto/barcode-scan-response.dto';
import { Sale } from '../entities/sale.entity';
import { TransactionInterceptor } from '../../../common/transaction.interceptor';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  createSale(@Body() createSaleDto: CreateSaleDto): Promise<Sale | null> {
    return this.saleService.createSale(createSaleDto);
  }

  @Get()
  findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Sale> {
    return this.saleService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.saleService.remove(id);
  }

  @Get('today/summary')
  getTodaysSales(): Promise<SalesSummaryDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.saleService.getSalesSummary(today, tomorrow);
  }

  @Get('product-by-barcode/:barcode')
  findProductWithStock(
    @Param('barcode') barcode: string,
  ): Promise<BarcodeScanResponseDto> {
    return this.saleService.findProductWithStockByBarcode(barcode);
  }

  @Get('product/:productId/history')
  getProductSalesHistory(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ProductSalesDto[]> {
    return this.saleService.getProductSalesHistory(productId, limit);
  }

  @Get('user/:userId/history')
  getUserSalesHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Sale[]> {
    return this.saleService.getUserSalesHistory(userId, limit);
  }

  @Get(':id/analytics')
  getSaleAnalytics(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SaleAnalyticsDto> {
    return this.saleService.getSaleAnalytics(id);
  }
}
