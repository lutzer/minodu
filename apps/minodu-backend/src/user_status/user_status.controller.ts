import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserStatusService } from './user_status.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('User status')
@Controller({
  path: 'user-status',
  version: "1"
})
export class UserStatusController {
  constructor(
    private readonly userStatusService: UserStatusService,
  ) {}

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "User status list", description: "All User status" })
  @Get()
  findAll() {
    return this.userStatusService.findAll();
  }
}
