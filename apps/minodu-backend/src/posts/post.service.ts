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

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly categoryService: PostCategoryService,
    private readonly tagService: PostTagService,
    private readonly resourceService: PostResourceService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
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
      post.attachment = createPostDto.attachment;
      post.attachmentKb = createPostDto.attachmentKb;
      post.user = user;
      post.postCategory = category;
      post.resources = resources;
      post.tags = tags;

      let res = await post.save();
      return DataFormater.getPost(res);
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`La publication avec le titre ( ${createPostDto.title} ) existe déja !}`);
      }
      console.log('Post.create.error', error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this.postRepository.count();
      return count;
    } catch (error) {
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
      console.log('Post.all.error', error);
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
      console.log('Post.allByTag.error', error);
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
      console.log('Post.allByResource.error', error);
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
      console.log('Post.one.error', error);
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
      console.log('Post.one.error', error);
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
      if(updatePostDto.image)
      one.image = updatePostDto.image;
      if(updatePostDto.attachment)
      one.attachment = updatePostDto.attachment;
    if(updatePostDto.attachmentKb)
      one.attachmentKb = updatePostDto.attachmentKb;
      one.postCategory = category;
      if(resources)
      one.resources = resources;
      if(tags)
      one.tags = tags;

      let res = await one.save();
      return DataFormater.getPost(res);
    } catch (error) {
      console.log('Post.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('Post.delete.error', error);
      throw error;
    }
  }

}
