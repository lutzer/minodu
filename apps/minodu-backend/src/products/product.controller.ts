import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './product.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';
import { UserGuard } from 'src/auth/guards/user.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Product")
@ApiBearerAuth()
@Controller({
  path: 'products',
  version: "1"
})
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) { }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Create Product", description: "Create a new Product" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the product',
        },
        description: {
          type: 'string',
          description: 'Description of the product',
        },
        price: {
          type: 'number',
          description: 'Price of the product',
        },
        sales_unit: {
          type: 'string',
          description: 'Product sales unit',
        },
        categoryId: {
          type: 'number',
          description: 'Product category ID',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name', 'description', 'sales_unit', 'categoryId', 'image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
    }),
  )
  create(@Body() createProduct: CreateProductDto,
  @UploadedFile() image: Express.Multer.File) {
    createProduct.image = image.filename;
      return this.productsService.create(createProduct);
  }

  @Public()
  @ApiOperation({ summary: "Product list", description: "All products list" })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Product infos", description: "Product infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService._findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update Product", description: "Update given product infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the product',
        },
        description: {
          type: 'string',
          description: 'Description of the product',
        },
        price: {
          type: 'number',
          description: 'Price of the product',
        },
        sales_unit: {
          type: 'string',
          description: 'Product sales unit',
        },
        categoryId: {
          type: 'number',
          description: 'Product category ID',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name', 'description', 'price', 'sales_unit', 'categoryId'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
    }),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updateProductDto.image = image.filename;
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Remove Product", description: "Remove the given Product" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
