import { Test, TestingModule } from '@nestjs/testing';
import { ProductOfferService } from './product_offer.service';
import { ProductOfferController } from './product_offer.controller';

describe('ProductOfferController', () => {
  let controller: ProductOfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOfferController],
      providers: [ProductOfferService],
    }).compile();

    controller = module.get<ProductOfferController>(ProductOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
