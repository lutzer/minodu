import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDemand } from './entities/demand.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductDemandController } from './demand.controller';
import { ProductDemandService } from './demand.service';
import { Partner } from 'src/partners/entities/partner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductDemand,
      Product,
      Partner
    ]),
  ],
  controllers: [ProductDemandController],
  providers: [ProductDemandService],
  exports: [ProductDemandService]
})
export class ProductDemandModule {}
