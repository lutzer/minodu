import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Partners")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'partners',
  version: "1"
})
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
  ) { }

 @ApiOperation({ summary: "Create Partner", description: "Create a new Partner" })
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @ApiOperation({ summary: "Partner list", description: "All Partner list" })
  @Public()
  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @ApiOperation({ summary: "Partner infos", description: "Partner infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService._findOne(+id);
  }

  @ApiOperation({ summary: "Update Partner", description: "Update given Partner infos" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(+id, updatePartnerDto);
  }

  @ApiOperation({ summary: "Remove Partner", description: "Remove the given Partner" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(+id);
  }
}
