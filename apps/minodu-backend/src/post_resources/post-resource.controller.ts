import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostResourceService } from './post-resource.service';
import { CreatePostResourceDto } from './dto/create-post-resource.dto';
import { UpdatePostResourceDto } from './dto/update-post-resource..dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'src/utils/common.util';
import { diskStorage } from 'multer';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Post resource")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'resource',
  version: "1"
})
export class PostResourceController {
  constructor(
    private readonly postResourceService: PostResourceService,
  ) { }

  @Roles(userRole.ADMIN)
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
  create(@Body() createPostResourceDto: CreatePostResourceDto,
  @UploadedFile() image: Express.Multer.File) {
    if(image)
      createPostResourceDto.image = image.filename;
    return this.postResourceService.create(createPostResourceDto);
  }

  @Public()
  @ApiOperation({ summary: "Resource list", description: "All resource list" })
  @Get()
  findAll() {
    return this.postResourceService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Resource infos", description: "Resource infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postResourceService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
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
  update(@Param('id') id: string, @Body() updatePostResourceDto: UpdatePostResourceDto, @UploadedFile() image: Express.Multer.File) {
    if(image)
    updatePostResourceDto.image = image.filename;
    return this.postResourceService.update(+id, updatePostResourceDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Resource", description: "Remove the given Resource" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postResourceService.remove(+id);
  }
}
