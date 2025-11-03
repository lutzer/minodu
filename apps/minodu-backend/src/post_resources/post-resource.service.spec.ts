import { Test, TestingModule } from '@nestjs/testing';
import { PostResourceService } from './post-resource.service';

describe('PostResourceService', () => {
  let service: PostResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostResourceService],
    }).compile();

    service = module.get<PostResourceService>(PostResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
