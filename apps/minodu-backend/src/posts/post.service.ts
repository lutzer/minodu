import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostTagService } from 'src/post_tags/post-tag.service';
import { PostResourceService } from 'src/post_resources/post-resource.service';
import { PostCategoryService } from 'src/post_categories/post-category.service';
import { UsersService } from 'src/users/user.service';
import { BaseConfig } from 'src/utils/common.util';
import { LoggerService } from 'src/logs/logger.service';
import { error } from 'winston';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly categoryService: PostCategoryService,
    private readonly tagService: PostTagService,
    private readonly resourceService: PostResourceService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly loggerService: LoggerService
  ) { }

  async create(createPostDto: CreatePostDto, currentUser) {
    try {

      const tagIds = createPostDto.tags.split(',')
      .map(id => id.trim())
      .map(Number);

      const resourceIds = createPostDto.resources.split(',')
      .map(id => id.trim())
      .map(Number);

      const user = await this.userService.findOne(currentUser.id);
      const category = await this.categoryService.findOne(+createPostDto.idCategory);
      const tags = await this.tagService.findByIds(tagIds);
      const resources = await this.resourceService.findByIds(resourceIds);

      const post = new Post();
      post.author = createPostDto.author;
      post.title = createPostDto.title;
      post.description = createPostDto.description;
      post.image = createPostDto.image;
      await BaseConfig.processImage(createPostDto.image);
      post.attachment = createPostDto.attachment;
      post.attachmentKb = createPostDto.attachmentKb;
      post.attachmentPdf = createPostDto.attachmentPdf;
      post.user = user;
      post.postCategory = category;
      post.resources = resources;
      post.tags = tags;

      const res = await post.save();
      this.loggerService.log('Post created successfully', PostService.name);  
      return DataFormater.getPost(res);
    } catch (error) {
        this.loggerService.error(`Error occurred while creating post: ${error.message}`, PostService.name);
        throw new ConflictException(`La publication avec le titre ( ${createPostDto.title} ) existe déja !}`);
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this.postRepository.count();
      return count;
    } catch (error) {
      this.loggerService.error(`Error occurred while counting posts: ${error.message}`, PostService.name);
      throw new Error(`Échec de la récupération du nombre de publications : ${error.message}`);
    }
  }

  async findAll() {
    try {
      const posts = await this.postRepository.find({
        relations: {tags:true, resources:true, postCategory:true}
      });
      return posts.map((post) => {
        return {
          ...DataFormater.getPost(post)
        }
      })
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching posts: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async findAllByTag(id: number) {
    try {
      const tag = await this.tagService.findOne(id);
      const posts = await this.postRepository.find({
        where: {
          tags: {
            id: tag.id
          }
        },
        relations: {tags:true, resources:true, postCategory:true}
      });

      return posts.map((post) => {
        return {
          ...DataFormater.getPost(post)
        }
      })
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching posts by tag: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async findAllByResource(id: number) {
    try {
      const resource = await this.resourceService.findOne(id)
      const posts = await this.postRepository.find({
        where: {
          tags: {
            id: resource.id
          }
        },
        relations: {tags:true, resources:true, postCategory:true}
      });

      return posts.map((post) => {
        return {
          ...DataFormater.getPost(post)
        }
      })
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching posts by resource: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.postRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching post: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.postRepository.findOne({ 
        where: { id },
        relations: {tags:true, resources:true, postCategory:true}
     });
      if (!one) {
        throw new NotFoundException("Publication non trouvé!");
      }
      return DataFormater.getPost(one);
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching post: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const tagIds = updatePostDto.tags
      .split(',')
      .map(id => id.trim())
      .map(Number)
      .filter(id => !isNaN(id) && id > 0);

      const resourceIds = updatePostDto.resources
      .split(',')
      .map(id => id.trim())
      .map(Number)
      .filter(id => !isNaN(id) && id > 0);

      const category = await this.categoryService.findOne(+updatePostDto.idCategory);
      const tags = (tagIds.length>0)? await this.tagService.findByIds(tagIds):null;
      const resources = (resourceIds.length>0)? await this.resourceService.findByIds(resourceIds):null;

      const one = await this.findOne(id);
      one.author = updatePostDto.author;
      one.title = updatePostDto.title;
      one.description = updatePostDto.description;
      if(updatePostDto.image){
        await BaseConfig.deleteFile(one.image);
        one.image = updatePostDto.image;
        await BaseConfig.processImage(updatePostDto.image);
      }
      if(updatePostDto.attachment){
        await BaseConfig.deleteFile(one.attachment);
        one.attachment = updatePostDto.attachment;
      }
      if(updatePostDto.attachmentKb){
        await BaseConfig.deleteFile(one.attachmentKb);
        one.attachmentKb = updatePostDto.attachmentKb;
      }
      if(updatePostDto.attachmentPdf){
        await BaseConfig.deleteFile(one.attachmentPdf);
        one.attachmentPdf = updatePostDto.attachmentPdf;
      }
      one.postCategory = category;
      if(resources)
      one.resources = resources;
      if(tags)
      one.tags = tags;

      const res = await one.save();
      this.loggerService.log('Post updated successfully', PostService.name);
      return DataFormater.getPost(res);
    } catch (error) {
      this.loggerService.error(`Error occurred while updating post: ${error.message}`, PostService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting post: ${error.message}`, PostService.name);
      throw error;
    }
  }

}
