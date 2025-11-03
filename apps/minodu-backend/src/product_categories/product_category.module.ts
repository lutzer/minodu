import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoriesController } from './product_category.controller';
import { ProductCategoriesService } from './product_category.service';
import { ProductCategory } from './entities/product_category.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory,
      Product
    ]),
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService]
})
export class ProductCategoriesModule {}
