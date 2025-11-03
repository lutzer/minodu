import { Test, TestingModule } from '@nestjs/testing';
import { ProductOfferService } from './product_offer.service';

describe('ProductOfferService', () => {
  let service: ProductOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOfferService],
    }).compile();

    service = module.get<ProductOfferService>(ProductOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
