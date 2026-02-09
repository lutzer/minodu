import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigurationService } from './configuration.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Configuration")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'config',
  version: "1"
})
export class ConfigurationController {
  constructor(
    private readonly configurationService: ConfigurationService
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Configuration infos", description: "Configuration infos by given ID" })
  @Get()
  findOne() {
    return this.configurationService.findOne(1);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Update Configuration", description: "Update default configuration" })
  @Patch()
  update(@Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.update(updateConfigurationDto);
  }
}
