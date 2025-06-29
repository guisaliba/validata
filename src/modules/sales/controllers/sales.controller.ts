import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { SaleService } from '../services/sale.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('product-by-barcode/:barcode')
  findProductWithStock(@Param('barcode') barcode: string) {
    return this.saleService.findProductWithStockByBarcode(barcode);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.createSale(createSaleDto);
  }

  @Get()
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.findOneWithRelations(id);
  }
}
