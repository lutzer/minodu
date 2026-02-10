import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Partners")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'partners',
  version: "1"
})
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Create Partner", description: "Create a new Partner" })
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Public()
  @ApiOperation({ summary: "Partner list", description: "All Partner list" })
  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Partner infos", description: "Partner infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Update Partner", description: "Update given Partner infos" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(+id, updatePartnerDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Partner", description: "Remove the given Partner" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(+id);
  }
}
