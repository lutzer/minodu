import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOffer } from './entities/product_offer.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductOfferController } from './product_offer.controller';
import { ProductOfferService } from './product_offer.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductOffer,
      Product,
      User
    ]),
  ],
  controllers: [ProductOfferController],
  providers: [ProductOfferService],
  exports: [ProductOfferService]
})
export class ProductOfferModule {}
