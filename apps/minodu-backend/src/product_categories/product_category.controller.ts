import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCategoriesService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { BaseConfig } from 'src/utils/common.util';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Product categories")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'product-categories',
  version: "1"
})
export class ProductCategoriesController {
  constructor(
    private readonly productCategoryService: ProductCategoriesService,
  ) { }

  @ApiOperation({ summary: "Create Category", description: "Create a new Category" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the category',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name'],
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
  create(@Body() createProductCategoryDto: CreateProductCategoryDto,
  @UploadedFile() image: Express.Multer.File) {
    if(image)
    createProductCategoryDto.image = image.filename;
      return this.productCategoryService.create(createProductCategoryDto);
  }

  @Public()
  @ApiOperation({ summary: "Category list", description: "All category list" })
  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @ApiOperation({ summary: "Category infos", description: "Category infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService._findOne(+id);
  }

  @ApiOperation({ summary: "Update Category", description: "Update given category infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the product category',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name'],
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
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updateProductCategoryDto.image = image.filename;
    return this.productCategoryService.update(+id, updateProductCategoryDto);
  }

  @ApiOperation({ summary: "Remove Category", description: "Remove the given Category" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(+id);
  }
}
