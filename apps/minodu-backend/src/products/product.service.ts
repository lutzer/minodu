import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategoriesService } from 'src/product_categories/product_category.service';
import { BaseConfig } from 'src/utils/common.util';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productCategoriesService: ProductCategoriesService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.productCategoriesService.findOne(createProductDto.categoryId);
     if (!category) {
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
      let res = await product.save();
      return DataFormater.getProduct(res);

    } catch (error) {
        throw new ConflictException(`Le produit ( ${createProductDto.name} ) existe déja !}`);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this.productRepository.count();
      return count;
    } catch (error) {
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
      console.log('Product.all.error', error);
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
      console.log('Product.one.error', error);
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
      console.log('Product.one.error', error);
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

      return one.save();
    } catch (error) {
      console.log('Product.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('Product.delete.error', error);
      throw error;
    }
  }

}
