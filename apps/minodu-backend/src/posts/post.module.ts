import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostTagModule } from 'src/post_tags/post-tag.module';
import { PostCategoryModule } from 'src/post_categories/post-category.module';
import { PostResourceModule } from 'src/post_resources/post-resource.module';
import { UsersModule } from 'src/users/user.module';
import { UsersService } from 'src/users/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
    ]),
    PostTagModule,
    PostCategoryModule,
    PostResourceModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
