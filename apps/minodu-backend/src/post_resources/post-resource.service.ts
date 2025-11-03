import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { PostResource } from './entities/post_resources.entity';
import { CreatePostResourceDto } from './dto/create-post-resource.dto';
import { UpdatePostResourceDto } from './dto/update-post-resource..dto';
import { BaseConfig } from 'src/utils/common.util';

@Injectable()
export class PostResourceService {

  constructor(
    @InjectRepository(PostResource)
    private readonly postResourceRepository: Repository<PostResource>,
  ) { }

  create(createPostResourceDto: CreatePostResourceDto) {
    try {
      const resource = new PostResource();
      resource.name = createPostResourceDto.name;
      resource.image = createPostResourceDto.image;
      return resource.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`La ressource ( ${createPostResourceDto.name} ) existe déja !}`);
      }
      console.log('PostResource.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const allResources = await this.postResourceRepository.find();

      return allResources.map((resource) => {
        return {
          ...DataFormater.getResource(resource)
        }
      })
    } catch (error) {
      console.log('PostResource.all.error', error);
      throw error;
    }
  }

  async findByIds(ids){
    const resources = await this.postResourceRepository.findByIds(ids);
    if (resources.length>0 && resources.length < ids.length) {
      throw new NotFoundException('Un ou plusieurs resources n\'existent pas !');
    }

    return resources;
  }

  async findOne(id: number) {
    try {
      const one = await this.postResourceRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('PostResource.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.postResourceRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getResource(one);
    } catch (error) {
      console.log('PostResource.one.error', error);
      throw error;
    }
  }

  async update(id: number, updatePostResourceDto: UpdatePostResourceDto) {
    try {
      const one = await this.findOne(id);
      one.name = updatePostResourceDto.name;
      if(updatePostResourceDto.image)
      one.image = updatePostResourceDto.image;
      return one.save();
    } catch (error) {
      console.log('PostResource.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('PostResource.delete.error', error);
      throw error;
    }
  }

}
