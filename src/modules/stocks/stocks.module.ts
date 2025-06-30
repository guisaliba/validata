import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';
import { StockRepository } from './repositories/stock.repository';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stock]),
    forwardRef(() => SalesModule),
  ],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockService],
})
export class StocksModule {}
