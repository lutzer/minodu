import { Test, TestingModule } from '@nestjs/testing';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';

describe('ForumController', () => {
  let controller: ForumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumController],
      providers: [ForumService],
    }).compile();

    controller = module.get<ForumController>(ForumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
