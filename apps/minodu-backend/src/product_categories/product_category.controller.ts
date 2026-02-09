import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCategoriesService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { BaseConfig } from 'src/utils/common.util';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Product categories")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'product-categories',
  version: "1"
})
export class ProductCategoriesController {
  constructor(
    private readonly productCategoryService: ProductCategoriesService,
  ) { }

  @Roles(userRole.ADMIN)
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
        destination: (req, file, cb) => {
        BaseConfig.setFilePath(req, file, cb);
        },
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
      limits: {
          fileSize: 5 * 1024 * 1024, // Limit to 5 MB
        }
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

  @Public()
  @ApiOperation({ summary: "Category infos", description: "Category infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
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
        destination: (req, file, cb) => {
        BaseConfig.setFilePath(req, file, cb);
        },
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.fileFilter,
      limits: {
          fileSize: 5 * 1024 * 1024, // Limit to 5 MB
        }
    }),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updateProductCategoryDto.image = image.filename;
    return this.productCategoryService.update(+id, updateProductCategoryDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Category", description: "Remove the given Category" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(+id);
  }
}
