import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Product")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'products',
  version: "1"
})
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) { }

  @Roles(userRole.ADMIN)
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

  @Roles(userRole.ADMIN)
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
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updateProductDto.image = image.filename;
    return this.productsService.update(+id, updateProductDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Product", description: "Remove the given Product" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
