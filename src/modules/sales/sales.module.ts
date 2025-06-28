import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { StocksModule } from '../stocks/stocks.module';
import { UsersModule } from '../users/users.module';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { SaleRepository } from './repositories/sale.repository';
import { SaleService } from './services/sale.service';
import { SaleController } from './controllers/sales.controller';

@Module({
  imports: [
    ProductsModule,
    StocksModule,
    UsersModule,
    TypeOrmModule.forFeature([Sale, SaleItem]),
  ],
  providers: [SaleRepository, SaleService],
  controllers: [SaleController],
})
export class SalesModule {}
