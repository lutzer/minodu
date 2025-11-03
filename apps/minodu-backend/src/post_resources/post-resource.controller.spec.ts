import { Test, TestingModule } from '@nestjs/testing';
import { PostResourceController } from './post-resource.controller';
import { PostResourceService } from './post-resource.service';

describe('PostResourceController', () => {
  let controller: PostResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostResourceController],
      providers: [PostResourceService],
    }).compile();

    controller = module.get<PostResourceController>(PostResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
