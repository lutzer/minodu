import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { PostCategory } from './entities/post_categories.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category..dto';

@Injectable()
export class PostCategoryService {

  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) { }

  create(createPostCategoryDto: CreatePostCategoryDto) {
    try {
      const category = new PostCategory();
      category.name = createPostCategoryDto.name.toUpperCase();
      category.nameKb = createPostCategoryDto.nameKb.toUpperCase();
      category.image = createPostCategoryDto.image;
      return category.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`La categorie ( ${createPostCategoryDto.name} ) existe déja !}`);
      }
      console.log('PostCategory.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const allCategories = await this.postCategoryRepository.find();
      return allCategories.map((category) => {
        return {
          ...DataFormater.getPostCategory(category)
        }
      })
    } catch (error) {
      console.log('PostCategory.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.postCategoryRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('PostCategory.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.postCategoryRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getPostCategory(one);
    } catch (error) {
      console.log('PostCategory.one.error', error);
      throw error;
    }
  }

  async update(id: number, updatePostCategoryDto: UpdatePostCategoryDto) {
    try {
      const one = await this.findOne(id);
      one.name = updatePostCategoryDto.name;
      one.nameKb = updatePostCategoryDto.nameKb;
      if(updatePostCategoryDto.image)
        one.image = updatePostCategoryDto.image;
      return one.save();
    } catch (error) {
      console.log('PostCategory.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('PostCategory.delete.error', error);
      throw error;
    }
  }

}
