import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserStatusService } from './user_status.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@ApiTags('User status')
@Controller({
  path: 'user-status',
  version: "1"
})
export class UserStatusController {
  constructor(
    private readonly userStatusService: UserStatusService,
  ) {}

  @ApiOperation({ summary: "User status list", description: "All User status" })
  @Get()
  findAll() {
    return this.userStatusService.findAll();
  }
}
