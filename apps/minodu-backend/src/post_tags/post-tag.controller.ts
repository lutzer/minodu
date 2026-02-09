import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostTagService } from './post-tag.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag..dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Post tag")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'tags',
  version: "1"
})
export class PostTagController {
  constructor(
    private readonly postTagService: PostTagService,
  ) { }

  @Roles(userRole.ADMIN)
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
  create(@Body() createPostTagDto: CreatePostTagDto,
  @UploadedFile() image: Express.Multer.File) {
    createPostTagDto.image = image.filename;
      return this.postTagService.create(createPostTagDto);
  }

  @Public()
  @ApiOperation({ summary: "Tag list", description: "All tag list" })
  @Get()
  findAll() {
    return this.postTagService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Tag infos", description: "Tag infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTagService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
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
  update(@Param('id') id: string, @Body() updatePostTagDto: UpdatePostTagDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostTagDto.image = image.filename;
    return this.postTagService.update(+id, updatePostTagDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Tag", description: "Remove the given Tag" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagService.remove(+id);
  }
}
