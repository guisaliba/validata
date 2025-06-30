import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import type { ProductPricingDto } from '../dto/product-pricing.dto';
import type { ProductAnalyticsDto } from '../dto/product-analytics.dto';
import type { ProductInventoryDto } from '../dto/product-inventory.dto';

export interface IProductService {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product>;
  findByBarcode(barcode: string): Promise<Product>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
  getProductWithStocks(id: string): Promise<Product>;
  getProductInventory(id: string): Promise<ProductInventoryDto>;
  getProductPricing(
    id: string,
    profitMarginThreshold: number,
  ): Promise<ProductPricingDto>;
  getProductAnalytics(id: string): Promise<ProductAnalyticsDto>;
  searchProducts(query: string): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByBrand(brand: string): Promise<Product[]>;
  updateCostPrice(id: string, newCostPrice: number): Promise<Product>;
  bulkUpdateCostPrices(
    updates: Array<{ id: string; cost_price: number }>,
  ): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  getProductsWithoutCostPrice(): Promise<Product[]>;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByBarcode(barcode: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(productData: CreateProductDto): Promise<Product>;
  update(id: string, productData: UpdateProductDto): Promise<Product | null>;
  delete(id: string): Promise<void>;
  findByIdWithStocks(id: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByBrand(brand: string): Promise<Product[]>;
  findLowStockProducts(): Promise<Product[]>;
  findProductsWithoutCostPrice(): Promise<Product[]>;
  findAllWithStocks(): Promise<Product[]>;
  findBestSellingProducts(limit?: number): Promise<Product[]>;
}
