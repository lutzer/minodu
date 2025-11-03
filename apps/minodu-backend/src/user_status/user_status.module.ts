import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatusService } from './user_status.service';
import { UserStatusController } from './user_status.controller';
import { UserStatus } from './entities/user_status.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStatus, 
      User,
      Role,
    ]),
  ],
  controllers: [UserStatusController],
  providers: [UserStatusService],
  exports: [UserStatusService]
})
export class UserStatusModule {}
