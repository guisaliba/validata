import type { BarcodeScanResponseDto } from 'src/modules/products/dto/barcode-scan-response.dto';
import type { Sale } from '../entities/sale.entity';
import type { ProductSalesDto } from '../dto/product-sales.dto';
import type { CreateSaleDto } from '../dto/create-sale.dto';
import type { SaleAnalyticsDto } from '../dto/sale-analytics-dto';
import type { SalesSummaryDto } from '../dto/sales-summary.dto';

export interface ISaleService {
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale>;
  createSale(createSaleDto: CreateSaleDto): Promise<Sale | null>;
  remove(id: string): Promise<void>;
  findProductWithStockByBarcode(
    barcode: string,
  ): Promise<BarcodeScanResponseDto>;
  getSaleAnalytics(id: string): Promise<SaleAnalyticsDto>;
  getSalesSummary(startDate: Date, endDate: Date): Promise<SalesSummaryDto>;
  getProductSalesHistory(
    productId: string,
    limit?: number,
  ): Promise<ProductSalesDto[]>;
  getUserSalesHistory(userId: string, limit?: number): Promise<Sale[]>;
}

export interface ISaleRepository {
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
  findByIdWithRelations(id: string): Promise<Sale | null>;
  remove(sale: Sale): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  findByUserId(userId: string, limit?: number): Promise<Sale[]>;
  findTodaysSales(): Promise<Sale[]>;
  findTopSellingPeriod(
    startDate: Date,
    endDate: Date,
    limit?: number,
  ): Promise<Sale[]>;
}
