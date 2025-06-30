import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, IsNull, LessThanOrEqual, Like } from 'typeorm';
import { Request } from 'express';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IProductRepository } from '../interfaces/product.interface';
import { BaseRepository } from '../../../common/base-repository';

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository
  extends BaseRepository
  implements IProductRepository
{
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findById(id: string): Promise<Product | null> {
    return this.getRepository(Product).findOneBy({ id });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.getRepository(Product).findOneBy({ barcode });
  }

  async findAll(): Promise<Product[]> {
    return this.getRepository(Product).find({
      order: { name: 'ASC' },
    });
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const repo = this.getRepository(Product);
    const product = repo.create(productData);
    return repo.save(product);
  }

  async update(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product | null> {
    const repo = this.getRepository(Product);
    await repo.update(id, productData);
    return repo.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.getRepository(Product).delete(id);
  }

  async findByIdWithStocks(id: string): Promise<Product | null> {
    return this.getRepository(Product).findOne({
      where: { id },
      relations: ['stocks'],
      order: {
        stocks: {
          expiration_date: 'ASC',
        },
      },
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.getRepository(Product).find({
      where: [
        { name: Like(`%${query}%`) },
        { brand: Like(`%${query}%`) },
        { category: Like(`%${query}%`) },
        { barcode: Like(`%${query}%`) },
      ],
      order: { name: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.getRepository(Product).find({
      where: { category },
      order: { name: 'ASC' },
    });
  }

  async findByBrand(brand: string): Promise<Product[]> {
    return this.getRepository(Product).find({
      where: { brand },
      order: { name: 'ASC' },
    });
  }

  async findLowStockProducts(): Promise<Product[]> {
    return this.getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.stocks', 'stock')
      .where('product.min_stock_level IS NOT NULL')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COALESCE(SUM(s.quantity), 0)')
          .from('stock', 's')
          .where('s.productId = product.id')
          .andWhere('s.quantity > 0')
          .andWhere('s.expiration_date > NOW()')
          .getQuery();
        return `(${subQuery}) <= product.min_stock_level`;
      })
      .orderBy('product.name', 'ASC')
      .getMany();
  }

  async findProductsWithoutCostPrice(): Promise<Product[]> {
    return this.getRepository(Product).find({
      where: [{ cost_price: IsNull() }, { cost_price: LessThanOrEqual(0) }],
      order: { name: 'ASC' },
    });
  }

  async findAllWithStocks(): Promise<Product[]> {
    return this.getRepository(Product).find({
      relations: ['stocks'],
      order: {
        name: 'ASC',
        stocks: {
          expiration_date: 'ASC',
        },
      },
    });
  }

  async findBestSellingProducts(limit: number = 10): Promise<Product[]> {
    return this.getRepository(Product).find({
      where: {
        sales_frequency: LessThanOrEqual(0),
      },
      order: { sales_frequency: 'DESC' },
      take: limit,
    });
  }
}
