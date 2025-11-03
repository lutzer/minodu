import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostResourceService } from './post-resource.service';
import { CreatePostResourceDto } from './dto/create-post-resource.dto';
import { UpdatePostResourceDto } from './dto/update-post-resource..dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'src/utils/common.util';
import { diskStorage } from 'multer';

@ApiTags("Post resource")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'resource',
  version: "1"
})
export class PostResourceController {
  constructor(
    private readonly postResourceService: PostResourceService,
  ) { }

  @ApiOperation({ summary: "Create Resource", description: "Create a new Resource" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the resource',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['name', 'image'],
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
  create(@Body() createPostResourceDto: CreatePostResourceDto,
  @UploadedFile() image: Express.Multer.File) {
    if(image)
      createPostResourceDto.image = image.filename;
    return this.postResourceService.create(createPostResourceDto);
  }

  @ApiOperation({ summary: "Resource list", description: "All resource list" })
  @Get()
  findAll() {
    return this.postResourceService.findAll();
  }

  @ApiOperation({ summary: "Resource infos", description: "Resource infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postResourceService._findOne(+id);
  }

  @ApiOperation({ summary: "Update Resource", description: "Update given resource infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the resource',
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
  update(@Param('id') id: string, @Body() updatePostResourceDto: UpdatePostResourceDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostResourceDto.image = image.filename;
    return this.postResourceService.update(+id, updatePostResourceDto);
  }

  @ApiOperation({ summary: "Remove Resource", description: "Remove the given Resource" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postResourceService.remove(+id);
  }
}
