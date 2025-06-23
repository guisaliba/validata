import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  createProduct(productData: CreateProductDto): Promise<Product>;
  updateProduct(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product | null>;
  deleteProduct(id: string): Promise<void>;
}
