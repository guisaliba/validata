import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInventoryDto } from './dto/product-inventory.dto';
import { ProductPricingDto } from './dto/product-pricing.dto';
import { ProductAnalyticsDto } from './dto/product-analytics.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('search/:query')
  searchProducts(@Param('query') query: string): Promise<Product[]> {
    return this.productService.searchProducts(query);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string): Promise<Product[]> {
    return this.productService.findByCategory(category);
  }

  @Get('brand/:brand')
  findByBrand(@Param('brand') brand: string): Promise<Product[]> {
    return this.productService.findByBrand(brand);
  }

  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string): Promise<Product> {
    return this.productService.findByBarcode(barcode);
  }

  @Get('alerts/low-stock')
  getLowStockProducts(): Promise<Product[]> {
    return this.productService.getLowStockProducts();
  }

  @Get('alerts/no-cost-price')
  getProductsWithoutCostPrice(): Promise<Product[]> {
    return this.productService.getProductsWithoutCostPrice();
  }

  @Patch('bulk/cost-prices')
  bulkUpdateCostPrices(
    @Body() body: { updates: Array<{ id: string; cost_price: number }> },
  ): Promise<Product[]> {
    return this.productService.bulkUpdateCostPrices(body.updates);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Get(':id/stocks')
  getProductWithStocks(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productService.getProductWithStocks(id);
  }

  @Get(':id/inventory')
  getProductInventory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductInventoryDto> {
    return this.productService.getProductInventory(id);
  }

  @Get(':id/pricing')
  getProductPricing(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('profitMarginThreshold', ParseIntPipe) profitMarginThreshold: number,
  ): Promise<ProductPricingDto> {
    return this.productService.getProductPricing(id, profitMarginThreshold);
  }

  @Get(':id/analytics')
  getProductAnalytics(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAnalyticsDto> {
    return this.productService.getProductAnalytics(id);
  }

  @Patch(':id/cost-price')
  updateCostPrice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { cost_price: number },
  ): Promise<Product> {
    return this.productService.updateCostPrice(id, body.cost_price);
  }
}
