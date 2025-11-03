import { Test, TestingModule } from '@nestjs/testing';
import { ProductDemandService } from './demand.service';

describe('ProductDemandService', () => {
  let service: ProductDemandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDemandService],
    }).compile();

    service = module.get<ProductDemandService>(ProductDemandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
