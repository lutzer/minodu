import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { ProductOfferService } from './product_offer.service';
import { CreateProductOfferDto } from './dto/create-product-offer.dto';
import { UpdateProductOfferDto } from './dto/update-product-offer.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Product offers")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'product-offers',
  version: "1"
})
export class ProductOfferController {
  constructor(
    private readonly productOfferService: ProductOfferService,
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Create ProductOffer", description: "Create a new Product offer" })
  @Post()
  create(@Body() createProductOfferDto: CreateProductOfferDto) {
    return this.productOfferService.create(createProductOfferDto);
  }

  @Public()
  @ApiOperation({ summary: "ProductOffer list", description: "All Product offers list" })
  @Get()
  findAll() {
    return this.productOfferService.findAll();
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Archived ProductOffer list", description: "All archived ProductOffer list" })
  @Get('archived')
  findAllArchived() {
    return this.productOfferService.findAllArchived();
  }

  @Public()
  @ApiOperation({ summary: "Search farmer productOffer list", description: "All ProductOffer list filtered by farmer" })
  @Get('farmer/:id')
  findAllByFarmer(@Param('id') id: string) {
    return this.productOfferService.findAllByFarmer(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "Search product productOffer list", description: "All productOffer list filtered by product" })
  @Get('product/:id')
  findAllByProduct(@Param('id') id: string) {
    return this.productOfferService.findAllByProduct(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "productOffer infos", description: "productOffer infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOfferService.findOne(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Archive productOffer", description: "Archive the given productOffer" })
  @Put('archive/:id')
  archive(@Param('id') id: string) {
    return this.productOfferService.archive(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Unarchive productOffer", description: "Unarchive the given productOffer" })
  @Put('unarchive/:id')
  unarchive(@Param('id') id: string) {
    return this.productOfferService.unarchive(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Update productOffer", description: "Update given productOffer infos" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductOfferDto: UpdateProductOfferDto) {
    return this.productOfferService.update(+id, updateProductOfferDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove productOffer", description: "Remove the given productOffer" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOfferService.remove(+id);
  }
}
