import { Test, TestingModule } from '@nestjs/testing';
import { PostCategoryController } from './partner.controller';
import { PostCategoryService } from './partner.service';

describe('PostCategoryController', () => {
  let controller: PostCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCategoryController],
      providers: [PostCategoryService],
    }).compile();

    controller = module.get<PostCategoryController>(PostCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
