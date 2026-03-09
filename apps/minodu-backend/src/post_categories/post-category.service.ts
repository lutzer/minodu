import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { PostCategory } from './entities/post_categories.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category..dto';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class PostCategoryService {

  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
    private readonly loggerService: LoggerService
  ) { }

  async create(createPostCategoryDto: CreatePostCategoryDto) {
    try {
      const category = new PostCategory();
      category.name = createPostCategoryDto.name.toUpperCase();
      category.nameKb = createPostCategoryDto.nameKb.toUpperCase();
      category.image = createPostCategoryDto.image;
      const savedCategory = await category.save();
      this.loggerService.log('Post category created successfully', PostCategoryService.name);
      return savedCategory;
    } catch (error) {
      this.loggerService.error(`Error occurred while creating post category: ${error.message}`, PostCategoryService.name);
        throw new ConflictException(`La categorie ( ${createPostCategoryDto.name} ) existe déja !}`);
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
      this.loggerService.error(`Error occurred while fetching post categories: ${error.message}`, PostCategoryService.name);
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
      this.loggerService.error(`Error occurred while fetching post category: ${error.message}`, PostCategoryService.name);
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
      this.loggerService.error(`Error occurred while fetching post category: ${error.message}`, PostCategoryService.name);
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
      this.loggerService.error(`Error occurred while updating post category: ${error.message}`, PostCategoryService.name);
      throw error;
    }
  }

  async remove(id: number) {
  try {
    // Load postCategory with their posts to check for dependencies
    const postCategory = await this.postCategoryRepository.findOne({
      where: { id },
      relations: {
        posts:true
      }
    });

    if (!postCategory) {
      this.loggerService.error(`Attempted to delete non-existent post category with ID ${id}`, PostCategoryService.name);
      throw new NotFoundException(`La catégorie avec l'ID ${id} est introuvable!`);
    }

    // Check if postCategory has any associated posts
    if (postCategory.posts?.length > 0) {
      this.loggerService.error(`Attempted to delete post category with associated posts: ${id}`, PostCategoryService.name);
      throw new BadRequestException(
        `Impossible de supprimer la catégorie ${postCategory.name} car elle a ${postCategory.posts.length} publication(s) dans le système.`
      );
    }

    return await postCategory.softRemove();
  } catch (error) {
    this.loggerService.error(`Failed to delete PostCategory ID ${id}: ${error.message}`, PostCategoryService.name);
    throw error;
  }
  }

}
