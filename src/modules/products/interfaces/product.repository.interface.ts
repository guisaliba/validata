import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(productData: CreateProductDto): Promise<Product>;
  update(id: string, productData: UpdateProductDto): Promise<Product | null>;
  delete(id: string): Promise<void>;
}
