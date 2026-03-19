import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';
import { User } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';

@ApiTags("Post")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'posts',
  version: "1"
})
export class PostController {
  constructor(
    private readonly postService: PostService
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Create Post", description: "Create a new Post" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idCategory: {
          type: 'number',
          description: 'Post Category ID',
          nullable: false,
        },
        author: {
          type: 'string',
          description: 'Post author',
          nullable: false,
        },
        title: {
          type: 'string',
          description: 'Post title',
          nullable: false,
        },
        description: {
          type: 'string',
          description: 'Post description',
          nullable: false,
        },
        image: {
          type: 'string',
          description: 'Post image',
          format: 'binary',
          nullable: true,
        },
        attachment: {
          type: 'string',
          description: 'Post attachment',
          format: 'binary',
          nullable: false,
        },
        attachmentKb: {
          type: 'string',
          description: 'Post attachment kabye',
          format: 'binary',
          nullable: false,
        },
        attachmentPdf: {
          type: 'string',
          description: 'Post attachment pdf',
          format: 'binary',
          nullable: false,
        },
        tags: {
          type: 'string',
          items: {
            type: 'string'
          },
          description: 'Post tags list',
          nullable: false,
        },
        resources: {
          type: 'string',
          items: {
            type: 'string'
          },
          description: 'Post resources list',
          nullable: true,
        },
      }
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'attachment', maxCount: 1 },
        { name: 'attachmentKb', maxCount: 1 },
        { name: 'attachmentPdf', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            BaseConfig.setFilePath(req, file, cb);
          },
          filename: BaseConfig.editFileName,
        }),
        fileFilter: BaseConfig.fileFilter,
        limits: {
          fileSize: 10 * 1024 * 1024, // Limit to 10 MB
        }
      },
    ),
  )
  create( @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
    attachmentKb?: Express.Multer.File[];
    attachmentPdf?: Express.Multer.File[];
  }, @Body() createPostDto: CreatePostDto, @User() currentUser) {
    if (files.image)
      createPostDto.image = files.image[0].filename;
    if (files.attachment)
      createPostDto.attachment = files.attachment[0].filename;
    if (files.attachmentKb)
      createPostDto.attachmentKb = files.attachmentKb[0].filename;
    if (files.attachmentPdf)
      createPostDto.attachmentPdf = files.attachmentPdf[0].filename;

    return this.postService.create(createPostDto, currentUser);
  }

  @Public()
  @ApiOperation({ summary: "Post list", description: "All post list" })
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @ApiOperation({ summary: "Post list", description: "All post list filtered by the selected resource" })
  @Get('resource/:id')
  findAllByResource(@Param('id') id: string) {
    return this.postService.findAllByResource(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "Post list", description: "All post list filtered by the selected tag" })
  @Get('tag/:id')
  findAllByTag(@Param('id') id: string) {
    return this.postService.findAllByTag(parseInt(id));
  }

  @Public()
  @ApiOperation({ summary: "Post infos", description: "Post infos by given ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService._findOne(+id);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Update post", description: "Update given post infos" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idCategory: {
          type: 'number',
          description: 'Post Category ID',
          nullable: false,
        },
        author: {
          type: 'string',
          description: 'Post author',
          nullable: false,
        },
        title: {
          type: 'string',
          description: 'Post title',
          nullable: false,
        },
        description: {
          type: 'string',
          description: 'Post description',
          nullable: false,
        },
        image: {
          type: 'string',
          description: 'Post image',
          format: 'binary',
          nullable: true,
        },
        attachment: {
          type: 'string',
          description: 'Post attachment',
          format: 'binary',
          nullable: true,
        },
        attachmentKb: {
          type: 'string',
          description: 'Post attachment kabye',
          format: 'binary',
          nullable: true,
        },
        attachmentPdf: {
          type: 'string',
          description: 'Post attachment kabye',
          format: 'binary',
          nullable: true,
        },
        tags: {
          type: 'string',
          items: {
            type: 'string'
          },
          description: 'Post tags list',
          nullable: false,
        },
        resources: {
          type: 'string',
          items: {
            type: 'string'
          },
          description: 'Post resources list',
          nullable: true,
        },
      },
      required: ['idCategory', 'author', 'title', 'description', 'tags'],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'attachment', maxCount: 1 },
        { name: 'attachmentKb', maxCount: 1 },
        { name: 'attachmentPdf', maxCount: 1 },
      ],
      {
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
      },
    ),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
    attachmentKb?: Express.Multer.File[];
    attachmentPdf?: Express.Multer.File[];
  }) {
    if (files.image)
      updatePostDto.image = files.image[0].filename;
    if (files.attachment)
      updatePostDto.attachment = files.attachment[0].filename;
    if (files.attachmentKb)
      updatePostDto.attachmentKb = files.attachmentKb[0].filename;
    if (files.attachmentPdf)
      updatePostDto.attachmentPdf = files.attachmentPdf[0].filename;

    return this.postService.update(+id, updatePostDto);
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove Post", description: "Remove the given post" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
