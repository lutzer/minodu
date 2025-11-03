import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostResource } from './entities/post_resources.entity';
import { PostResourceController } from './post-resource.controller';
import { PostResourceService } from './post-resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostResource,
    ]),
  ],
  controllers: [PostResourceController],
  providers: [PostResourceService],
  exports: [PostResourceService]
})
export class PostResourceModule {}
