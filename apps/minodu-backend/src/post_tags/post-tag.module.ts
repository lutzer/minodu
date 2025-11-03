import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { PostTag } from './entities/post_tag.entity';
import { PostTagController } from './post-tag.controller';
import { PostTagService } from './post-tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostTag,
    ]),
  ],
  controllers: [PostTagController],
  providers: [PostTagService],
  exports: [PostTagService]
})
export class PostTagModule {}
