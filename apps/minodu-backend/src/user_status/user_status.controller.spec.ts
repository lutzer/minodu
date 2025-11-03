import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusController } from './user_status.controller';
import { UserStatusService } from './user_status.service';

describe('UserStatusController', () => {
  let controller: UserStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStatusController],
      providers: [UserStatusService],
    }).compile();

    controller = module.get<UserStatusController>(UserStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
