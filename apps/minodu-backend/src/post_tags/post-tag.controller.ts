import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostTagService } from './post-tag.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag..dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';

@ApiTags("Post tag")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'tags',
  version: "1"
})
export class PostTagController {
  constructor(
    private readonly postTagService: PostTagService,
  ) { }

  @ApiOperation({ summary: "Create Tag", description: "Create a new Tag" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the tag',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['image'],
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
  create(@Body() createPostTagDto: CreatePostTagDto,
  @UploadedFile() image: Express.Multer.File) {
    createPostTagDto.image = image.filename;
      return this.postTagService.create(createPostTagDto);
  }

  @ApiOperation({ summary: "Tag list", description: "All tag list" })
  @Get()
  findAll() {
    return this.postTagService.findAll();
  }

  @ApiOperation({ summary: "Tag infos", description: "Tag infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTagService._findOne(+id);
  }

  @ApiOperation({ summary: "Update Tag", description: "Update given tag infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the tag',
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
  update(@Param('id') id: string, @Body() updatePostTagDto: UpdatePostTagDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostTagDto.image = image.filename;
    return this.postTagService.update(+id, updatePostTagDto);
  }

  @ApiOperation({ summary: "Remove Tag", description: "Remove the given Tag" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagService.remove(+id);
  }
}
