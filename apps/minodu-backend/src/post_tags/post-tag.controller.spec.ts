import { Test, TestingModule } from '@nestjs/testing';
import { PostTagService } from './post-tag.service';
import { PostTagController } from './post-tag.controller';

describe('PostTagController', () => {
  let controller: PostTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostTagController],
      providers: [PostTagService],
    }).compile();

    controller = module.get<PostTagController>(PostTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
