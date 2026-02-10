import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from './entities/user_role.enum';

@ApiTags("Role")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'roles',
  version: "1"
})
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Roles list", description: "All role list" })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Role infos", description: "Role infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

}
