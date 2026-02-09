import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { PostTag } from './entities/post_tag.entity';
import { Post } from 'src/posts/entities/post.entity';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag..dto';
import { BaseConfig } from 'src/utils/common.util';

@Injectable()
export class PostTagService {

  constructor(
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) { }

  create(createPostTagDto: CreatePostTagDto) {
    try {
      const tag = new PostTag();
      tag.name = createPostTagDto.name.toUpperCase();
      tag.image = createPostTagDto.image;
      return tag.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`Le tag ( ${createPostTagDto.name} ) existe déja !}`);
      }
      console.log('Tag.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const allTags = await this.postTagRepository.find();

      return allTags.map((tag) => {
        return {
          ...DataFormater.getTag(tag)
        }
      })
    } catch (error) {
      console.log('Tag.all.error', error);
      throw error;
    }
  }

  async findByIds(ids){
    const tags = await this.postTagRepository.findByIds(ids);
    if (!tags || tags.length < ids.length) {
      throw new NotFoundException('Un ou plusieurs tags n\'existent pas !');
    }

    return tags;
  }

  async findOne(id: number) {
    try {
      const one = await this.postTagRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('Tag.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.postTagRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getTag(one);
    } catch (error) {
      console.log('Tag.one.error', error);
      throw error;
    }
  }

  async update(id: number, updatePostTagDto: UpdatePostTagDto) {
    try {
      const one = await this.findOne(id);
      one.name = updatePostTagDto.name;
      if(updatePostTagDto.image){
        await BaseConfig.deleteFile(one.image);
        one.image = updatePostTagDto.image;
      }
      return one.save();
    } catch (error) {
      console.log('Tag.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('Tag.delete.error', error);
      throw error;
    }
  }

}
