import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategory } from './entities/product_category.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { BaseConfig } from 'src/utils/common.util';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ProductCategoriesService {

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly loggerService: LoggerService
  ) { }

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    try {
      const category = new ProductCategory();
      category.name = createProductCategoryDto.name.toUpperCase();
      category.image = createProductCategoryDto.image;
      await BaseConfig.processImage(createProductCategoryDto.image);
      const res = await category.save();
      this.loggerService.log('Product category created successfully', ProductCategoriesService.name);
      return DataFormater.getProductCategory(res);
    } catch (error) {
      this.loggerService.error(`Error occurred while creating product category: ${error.message}`, ProductCategoriesService.name);
      throw new ConflictException(`La categorie ( ${createProductCategoryDto.name} ) existe déja !}`);
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
      this.loggerService.error(`Error occurred while fetching product categories: ${error.message}`, ProductCategoriesService.name);
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
      this.loggerService.error(`Error occurred while fetching product category: ${error.message}`, ProductCategoriesService.name);
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
      this.loggerService.error(`Error occurred while fetching product category: ${error.message}`, ProductCategoriesService.name);
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
      const res = await one.save();
      this.loggerService.log('Product category updated successfully', ProductCategoriesService.name);
      return DataFormater.getProductCategory(res);
    } catch (error) {
      this.loggerService.error(`Error occurred while updating product category: ${error.message}`, ProductCategoriesService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Load product category with their products to check for dependencies
      const productCategory = await this.productCategoryRepository.findOne({
        where: { id },
        relations: {
          products:true
        }
      });
  
      if (!productCategory) {
        this.loggerService.error(`Attempted to delete product category with ID ${id} but it was not found`, ProductCategoriesService.name);
        throw new NotFoundException(`La catégorie de produit avec l'ID ${id} est introuvable!`);
      }
  
      // Check if tag has any associated posts
      if (productCategory.products?.length > 0) {
        this.loggerService.error(`Attempted to delete product category with ID ${id} but it has ${productCategory.products.length} associated products`, ProductCategoriesService.name);
        throw new BadRequestException(
          `Impossible de supprimer la catégorie de produit ${productCategory.name} car elle a ${productCategory.products.length} produit(s) dans le système.`
        );
      }
  
      return await productCategory.softRemove();
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting product category: ${error.message}`, ProductCategoriesService.name);
      throw error;
    }
  }

}
