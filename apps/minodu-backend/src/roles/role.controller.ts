import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags("Role")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'roles',
  version: "1"
})
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) { }


  @ApiOperation({ summary: "Roles list", description: "All role list" })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: "Role infos", description: "Role infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

}
