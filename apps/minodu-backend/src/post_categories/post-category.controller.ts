import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category..dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'src/utils/common.util';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Post categories")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'post-categories',
  version: "1"
})
export class PostCategoryController {
  constructor(
    private readonly postCategoryService: PostCategoryService,
  ) { }

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
  create(@Body() createPostCategoryDto: CreatePostCategoryDto,
  @UploadedFile() image: Express.Multer.File) {
    if(image)
    createPostCategoryDto.image = image.filename;
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @ApiOperation({ summary: "PostCategory list", description: "All PostCategory list" })
  @Public()
  @Get()
  findAll() {
    return this.postCategoryService.findAll();
  }

  @ApiOperation({ summary: "PostCategory infos", description: "PostCategory infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postCategoryService._findOne(+id);
  }


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
  update(@Param('id') id: string, @Body() updatePostCategoryDto: UpdatePostCategoryDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostCategoryDto.image = image.filename;
    return this.postCategoryService.update(+id, updatePostCategoryDto);
  }

  @ApiOperation({ summary: "Remove PostCategory", description: "Remove the given PostCategory" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCategoryService.remove(+id);
  }
}
