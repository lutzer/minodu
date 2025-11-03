import { Test, TestingModule } from '@nestjs/testing';
import { ProductDemandController } from './demand.controller';
import { ProductDemandService } from './demand.service';

describe('ProductDemandController', () => {
  let controller: ProductDemandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDemandController],
      providers: [ProductDemandService],
    }).compile();

    controller = module.get<ProductDemandController>(ProductDemandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
