import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';
import { StockRepository } from './repositories/stock.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockService],
})
export class StocksModule {}
