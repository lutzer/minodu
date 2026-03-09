import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategoriesService } from 'src/product_categories/product_category.service';
import { BaseConfig } from 'src/utils/common.util';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly loggerService: LoggerService
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.productCategoriesService.findOne(createProductDto.categoryId);
     if (!category) {
        this.loggerService.error(`Product category not found with id: ${createProductDto.categoryId}`, ProductsService.name);
        throw new NotFoundException('Catégorie non trouvé !');
     }

      const product = new Product();
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.sales_unit = createProductDto.sales_unit;
      product.price = createProductDto.price;
      product.productCategory = category;
      product.image = createProductDto.image;
      await BaseConfig.processImage(createProductDto.image);
      const res = await product.save();
      this.loggerService.log('Product created successfully', ProductsService.name);
      return DataFormater.getProduct(res);
    } catch (error) {
        this.loggerService.error(`Error occurred while creating product: ${error.message}`, ProductsService.name);
        throw new ConflictException(`Le produit ( ${createProductDto.name} ) existe déja !}`);
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this.productRepository.count();
      return count;
    } catch (error) {
      this.loggerService.error(`Error occurred while counting products: ${error.message}`, ProductsService.name);
      throw new Error(`Échec de la récupération du nombre de produits : ${error.message}`);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.find({
        relations:{productCategory:true, productOffers:true}
      });

      return products.map((product) => {
        return {
          ...DataFormater.getProduct(product)
        }
      })
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching products: ${error.message}`, ProductsService.name );
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.productRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product: ${error.message}`, ProductsService.name);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.productRepository.findOne({ 
        where: { id },
        relations:{productCategory:true, productOffers:true}
      });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getProduct(one);
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product: ${error.message}`, ProductsService.name);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const category = await this.productCategoriesService.findOne(updateProductDto.categoryId);
      if (!category)
        throw new NotFoundException('Catégorie non trouvé !');

      const one = await this.findOne(id);
      one.name = updateProductDto.name;
      one.description = updateProductDto.description;
      one.productCategory = category;
      one.price = updateProductDto.price;
      one.sales_unit = updateProductDto.sales_unit;
      if(updateProductDto.image){
        await BaseConfig.deleteFile(one.image);
        one.image = updateProductDto.image;
        await BaseConfig.processImage(updateProductDto.image);
      }

      const res = await one.save();
      this.loggerService.log('Product updated successfully', ProductsService.name);
      return DataFormater.getProduct(res);
    } catch (error) {
      this.loggerService.error(`Error occurred while updating product: ${error.message}`, ProductsService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      this.loggerService.error(`Error occurred while removing product: ${error.message}`, ProductsService.name);
      throw error;
    }
  }

}
