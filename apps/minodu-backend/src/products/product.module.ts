import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductCategoriesModule } from 'src/product_categories/product_category.module';
import { ProductOfferModule } from 'src/product_offers/product_offer.module';
import { ProductDemandModule } from 'src/product_demands/demand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
    ]),
    ProductCategoriesModule,
    ProductOfferModule,
    ProductDemandModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
