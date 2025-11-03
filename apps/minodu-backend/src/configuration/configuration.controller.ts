import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Configuration } from './entities/configuration.entity';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigurationService } from './configuration.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags("Configuration")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'config',
  version: "1"
})
export class ConfigurationController {
  constructor(
    private readonly configurationService: ConfigurationService
  ) { }

  @ApiOperation({ summary: "Configuration infos", description: "Configuration infos by given ID" })
  @Get()
  findOne() {
    return this.configurationService.findOne(1);
  }

  @ApiOperation({ summary: "Update Configuration", description: "Update default configuration" })
  @Patch()
  update(@Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.update(updateConfigurationDto);
  }
}
