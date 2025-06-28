import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';
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
    return this.getRepository(Product).find();
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
}
