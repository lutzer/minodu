import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDemandService } from './demand.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateProductDemandDto } from './dto/create-product-demand.dto';
import { UpdateProductDemandDto } from './dto/update-product-demand.dto';

@ApiTags("Product demand")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'product-demands',
  version: "1"
})
export class ProductDemandController {
  constructor(
    private readonly productDemandService: ProductDemandService,
  ) { }

  @ApiOperation({ summary: "Create ProductDemand", description: "Create a new Product's Demand" })
  @Post()
  create(@Body() createProductDemandDto: CreateProductDemandDto) {
    return this.productDemandService.create(createProductDemandDto);
  }

  @Public()
  @ApiOperation({ summary: "ProductDemand list", description: "All active ProductDemand list" })
  @Get()
  findAll() {
    return this.productDemandService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Archived ProductDemand list", description: "All archived ProductDemand list" })
  @Get('archived')
  findAllArchived() {
    return this.productDemandService.findAllArchived();
  }

  @Public()
  @ApiOperation({ summary: "Search partner ProductDemand list", description: "All product demand list filtered by partner" })
  @Get('partner/:id')
  findAllByFarmer(@Param('id') id: string) {
    return this.productDemandService.findAllByPartner(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "Search ProductDemand list", description: "All product demand list filtered by product" })
  @Get('product/:id')
  findAllByProduct(@Param('id') id: string) {
    return this.productDemandService.findAllByProduct(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "ProductDemand infos", description: "Product demand infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDemandService.findOne(+id);
  }

  @ApiOperation({ summary: "Archive ProductDemand", description: "Archive a satisfied ProductDemand" })
  @Put(':id/archive')
  archive(@Param('id') id: string) {
    return this.productDemandService.archive(+id);
  }

  @ApiOperation({ summary: "Unarchive ProductDemand", description: "Unarchive a ProductDemand" })
  @Put(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.productDemandService.unarchive(+id);
  }

  @ApiOperation({ summary: "Update ProductDemand", description: "Update given ProductDemand infos" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDemandDto: UpdateProductDemandDto) {
    return this.productDemandService.update(+id, updateProductDemandDto);
  }

  @ApiOperation({ summary: "Remove ProductDemand", description: "Remove the given ProductDemand" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDemandService.remove(+id);
  }
}