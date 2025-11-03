import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/post_categories.entity';
import { PostCategoryService } from './post-category.service';
import { PostCategoryController } from './post-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostCategory,
    ]),
  ],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  exports: [PostCategoryService]
})
export class PostCategoryModule {}
