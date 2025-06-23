import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Product | null> {
    return this.findOneBy({ id });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.findOneBy({ barcode });
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const product = this.create(productData) as Product;
    return this.save(product);
  }

  async updateProduct(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.update(id, productData);
    return this.findById(id);
  }
}
