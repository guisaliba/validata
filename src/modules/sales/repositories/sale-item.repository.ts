import { Injectable, Scope, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SaleItem } from '../entities/sale-item.entity';
import { BaseRepository } from '../../../common/base-repository';
import { ISaleItemRepository } from '../interfaces/sale-item.interface';
import { ProductSalesStatsRaw } from '../dto/product-sales-stats-raw.dto';

@Injectable({ scope: Scope.REQUEST })
export class SaleItemRepository
  extends BaseRepository
  implements ISaleItemRepository
{
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findById(id: string): Promise<SaleItem | null> {
    return this.getRepository(SaleItem).findOneBy({ id });
  }

  async findBySaleId(saleId: string): Promise<SaleItem[]> {
    return this.getRepository(SaleItem).find({
      where: { sale_id: saleId },
      relations: ['product'],
    });
  }

  async remove(saleItem: SaleItem): Promise<void> {
    await this.getRepository(SaleItem).remove(saleItem);
  }

  async findByProductId(
    productId: string,
    limit: number = 50,
  ): Promise<SaleItem[]> {
    return this.getRepository(SaleItem).find({
      where: { product_id: productId },
      relations: ['sale', 'sale.user', 'product'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getProductSalesStats(productId: string): Promise<{
    totalQuantitySold: number;
    totalRevenue: number;
    averagePrice: number;
    salesCount: number;
  }> {
    const result: ProductSalesStatsRaw | null | undefined =
      await this.getRepository(SaleItem)
        .createQueryBuilder('item')
        .select([
          'SUM(item.quantity) as totalQuantitySold',
          'SUM(item.quantity * item.unit_price) as totalRevenue',
          'AVG(item.unit_price) as averagePrice',
          'COUNT(*) as salesCount',
        ])
        .where('item.product_id = :productId', { productId })
        .getRawOne();

    if (!result) {
      return {
        totalQuantitySold: 0,
        totalRevenue: 0,
        averagePrice: 0,
        salesCount: 0,
      };
    }

    return {
      totalQuantitySold: parseInt(result.totalQuantitySold) || 0,
      totalRevenue: parseFloat(result.totalRevenue) || 0,
      averagePrice: parseFloat(result.averagePrice) || 0,
      salesCount: parseInt(result.salesCount) || 0,
    };
  }

  async findTopSellingProducts(limit: number = 10): Promise<
    Array<{
      productId: string;
      productName: string;
      totalQuantitySold: number;
      totalRevenue: number;
    }>
  > {
    return this.getRepository(SaleItem)
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .select([
        'item.product_id as productId',
        'product.name as productName',
        'SUM(item.quantity) as totalQuantitySold',
        'SUM(item.quantity * item.unit_price) as totalRevenue',
      ])
      .groupBy('item.product_id, product.name')
      .orderBy('totalQuantitySold', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
