import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { User } from 'src/auth/decorators/user.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'users',
  version: "1"
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: 'Users list', description: 'All users list' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({
    summary: 'User dashboard',
    description: 'Get the current admin dashboard',
  })
  @Get('dashboard')
  findAdminDashboard(@User() user) {
    return this.usersService.getAdminDashboard(user.id);
  }

  @Roles(userRole.ADMIN, userRole.USER)
  @ApiOperation({
    summary: 'User details',
    description: 'Get the current user account details',
  })
  @Get('current')
  findCurrentUser(@User() user) {
    return this.usersService._findOne(user.id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: 'User infos', description: 'Given user infos' })
  @ApiParam({ type: Number, name: 'id', description: 'Isuer ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService._findOne(+id);
  }

  @ApiOperation({ summary: 'User infos', description: 'Given user infos' })
  @ApiParam({ type: Number, name: 'id', description: 'Isuer ID' })
  @Get('contact-person')
  findContactPerson() {
    return this.usersService.findContactPerson();
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({summary: "Create User", description: "Create new user"})
  @Post()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(userRole.ADMIN, userRole.USER)
  @ApiOperation({
    summary: 'Update current user data',
    description: 'Update given User data',
  })
  @Patch()
  updateConnectedUser(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateCurrentUser(updateUserDto, user);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({
    summary: 'Update user data',
    description: 'Update given User data',
  })
  @ApiParam({ type: Number, name: 'id', description: 'User ID' })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Roles(userRole.ADMIN, userRole.USER)
  @Put('password')
  @ApiOperation({
    summary: 'Modifiy password',
    description: 'Modifiy user password',
  })
  changePassword(@User() user, @Body() updatePwdDto: UpdatePwdDto) {
   this.usersService.changePwd(updatePwdDto, user.id);
  }

}
