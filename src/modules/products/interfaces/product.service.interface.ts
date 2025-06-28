import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductService {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}
