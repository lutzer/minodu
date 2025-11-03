import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UpdatePwdDto, UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserGuard } from 'src/auth/guards/user.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags('User')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: "1"
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Users list', description: 'All users list' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'User dashboard',
    description: 'Get the current admin dashboard',
  })
  @Get('dashboard')
  findAdminDashboard(@User() user) {
    return this.usersService.getAdminDashboard(user.id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'User details',
    description: 'Get the current user account details',
  })
  @Get('current')
  findCurrentUser(@User() user) {
    return this.usersService._findOne(user.id);
  }

  @ApiOperation({ summary: 'User infos', description: 'Given user infos' })
  @ApiParam({ type: Number, name: 'id', description: 'Isuer ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService._findOne(+id);
  }

  @ApiOperation({
    summary: 'Update current user data',
    description: 'Update given User data',
  })
  @Patch()
  updateConnectedUser(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateCurrentUser(updateUserDto, user);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update user data',
    description: 'Update given User data',
  })
  @ApiParam({ type: Number, name: 'id', description: 'User ID' })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Patch('password')
  @ApiOperation({
    summary: 'Modifiy password',
    description: 'Modifiy user password',
  })
  changePwd(@User() user, @Body() updatePwdDto: UpdatePwdDto) {
    return this.usersService.changePwd(updatePwdDto, user);
  }

}
