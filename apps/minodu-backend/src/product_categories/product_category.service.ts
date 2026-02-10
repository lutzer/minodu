import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategory } from './entities/product_category.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { BaseConfig } from 'src/utils/common.util';

@Injectable()
export class ProductCategoriesService {

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    try {
      const category = new ProductCategory();
      category.name = createProductCategoryDto.name.toUpperCase();
      category.image = createProductCategoryDto.image;
      await BaseConfig.processImage(createProductCategoryDto.image);
      return category.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`La categorie ( ${createProductCategoryDto.name} ) existe déja !}`);
      }
      console.log('ProductCategory.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const allCategories= await this.productCategoryRepository.find();

      return allCategories.map((category) => {
        return {
          ...DataFormater.getProductCategory(category)
        }
      })
    } catch (error) {
      console.log('ProductCategory.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.productCategoryRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('ProductCategory.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.productCategoryRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getProductCategory(one);
    } catch (error) {
      console.log('ProductCategory.one.error', error);
      throw error;
    }
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    try {
      const one = await this.findOne(id);
      one.name = updateProductCategoryDto.name;
      if(one.image){
        await BaseConfig.deleteFile(one.image);
        one.image = updateProductCategoryDto.image;
        await BaseConfig.processImage(updateProductCategoryDto.image);
      }
      return one.save();
    } catch (error) {
      console.log('ProductCategory.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('ProductCategory.delete.error', error);
      throw error;
    }
  }

}
