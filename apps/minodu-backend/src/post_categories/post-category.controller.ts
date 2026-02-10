import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category..dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'src/utils/common.util';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Post categories")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'post-categories',
  version: "1"
})
export class PostCategoryController {
  constructor(
    private readonly postCategoryService: PostCategoryService,
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Create PostCategory", description: "Create a new PostCategory" })
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
        nameKb: {
          type: 'string',
          description: 'Name of the category in Kabye',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name', 'nameKb'],
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
  create(@Body() createPostCategoryDto: CreatePostCategoryDto,
  @UploadedFile() image: Express.Multer.File) {
    if(image)
    createPostCategoryDto.image = image.filename;
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @Public()
  @ApiOperation({ summary: "PostCategory list", description: "All PostCategory list" })
  @Get()
  findAll() {
    return this.postCategoryService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "PostCategory infos", description: "PostCategory infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postCategoryService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Update PostCategory", description: "Update given PostCategory infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the category',
        },
        nameKb: {
          type: 'string',
          description: 'Name of the category in Kabye',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name', 'nameKb'],
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
  update(@Param('id') id: string, @Body() updatePostCategoryDto: UpdatePostCategoryDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostCategoryDto.image = image.filename;
    return this.postCategoryService.update(+id, updatePostCategoryDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove PostCategory", description: "Remove the given PostCategory" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCategoryService.remove(+id);
  }
}
