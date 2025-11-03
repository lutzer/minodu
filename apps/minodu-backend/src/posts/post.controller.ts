import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseConfig } from 'src/utils/common.util';
import { UserGuard } from 'src/auth/guards/user.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("Post")
@ApiBearerAuth()
@Controller({
  path: 'posts',
  version: "1"
})
export class PostController {
  constructor(
    private readonly postService: PostService
  ) { }

  @UseGuards(AdminGuard)
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
      ],
      {
        storage: diskStorage({
          destination: BaseConfig.setFilePath,
          filename: BaseConfig.editFileName,
        }),
        fileFilter: BaseConfig.fileFilter,
      },
    ),
  )
  create( @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
    attachmentKb?: Express.Multer.File[];
  }, @Body() createPostDto: CreatePostDto, @User() currentUser) {
    if (files.image)
      createPostDto.image = files.image[0].filename;
    if (files.attachment)
      createPostDto.attachment = files.attachment[0].filename;
    if (files.attachmentKb)
      createPostDto.attachmentKb = files.attachmentKb[0].filename;

    return this.postService.create(createPostDto, currentUser);
  }

  @ApiOperation({ summary: "Post list", description: "All post list" })
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(AdminGuard, UserGuard)
  @ApiOperation({ summary: "Post list", description: "All post list filtered by the selected resource" })
  @Get('resource/:id')
  findAllByResource(@Param('id') id: string) {
    return this.postService.findAllByResource(parseInt(id));
  }

  @UseGuards(AdminGuard, UserGuard)
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

  @UseGuards(AdminGuard)
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
      ],
      {
        storage: diskStorage({
          destination: BaseConfig.setFilePath,
          filename: BaseConfig.editFileName,
        }),
        fileFilter: BaseConfig.fileFilter,
      },
    ),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
    attachmentKb?: Express.Multer.File[];
  }) {
    if (files.image)
      updatePostDto.image = files.image[0].filename;
    if (files.attachment)
      updatePostDto.attachment = files.attachment[0].filename;
    if (files.attachmentKb)
      updatePostDto.attachmentKb = files.attachmentKb[0].filename;

    return this.postService.update(+id, updatePostDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Remove Post", description: "Remove the given post" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
