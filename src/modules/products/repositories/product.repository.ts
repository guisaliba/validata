import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IProductRepository } from '../interfaces/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOneBy({ id });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.repository.findOneBy({ barcode });
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const product = this.repository.create(productData);

    return this.repository.save(product);
  }

  async update(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product | null> {
    await this.repository.update(id, productData);

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
