import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { ProductOffer } from './entities/product_offer.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProductOfferDto } from './dto/create-product-offer.dto';
import { UpdateProductOfferDto } from './dto/update-product-offer.dto';

@Injectable()
export class ProductOfferService {

  constructor(
    @InjectRepository(ProductOffer)
    private readonly productOfferRepository: Repository<ProductOffer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductOfferDto: CreateProductOfferDto) {
    try {
      const farmer = await this.userRepository.findOne({ where: { id: createProductOfferDto.farmerId }})
      if (!farmer) {
        throw new NotFoundException('Agriculteur non trouvé !');
      }      

      const product = await this.productRepository.findOne({ where: { id: createProductOfferDto.productId } })
      if (!product) {
        throw new NotFoundException('Produit non trouvé !');
      }      

      const productOffer = new ProductOffer();
      productOffer.user = farmer;
      productOffer.product = product;
      productOffer.quantity = productOffer.quantity;

      return productOffer.save().then((saved) => {
        return DataFormater.getProductOffer(saved);
      });
    } catch (error) {
      console.log('ProductOffer.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.productOfferRepository.find({
        relations:{
          product:true,
          user: true
      }
      });

      return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      console.log('ProductOffer.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.productOfferRepository.findOne({ 
        where: { id },
      relations:{
          product:true,
          user:true
      }
    });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getProductOffer(one);;
    } catch (error) {
      console.log('ProductOffer.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.productOfferRepository.findOne({ 
        where: { id },
      relations:{
          product:true,
          user: true
      }
    });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('ProductOffer.one.error', error);
      throw error;
    }
  }

  async findAllByProduct(productId: number) {
    try {
      const data = await this.productOfferRepository.find({ 
        where: { 
          product:{id:productId} 
        },
        relations:{
          product:true,
          user:true
      } 
      });
      if (!data) {
        throw new NotFoundException();
      }
      
       return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      console.log('ProductOffer.byProduct.error', error);
      throw error;
    }
  }

  async findAllByFarmer(userId: number) {
    try {
      const data = await this.productOfferRepository.find({ 
        where: { 
          user:{id:userId} 
        },
        relations:{
          product:true,
          user: true
      }
      });
      if (!data) {
        throw new NotFoundException();
      }
      return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      console.log('ProductOffer.byFarmer.error', error);
      throw error;
    }
  }

  async update(id: number, updateProductOfferDto: UpdateProductOfferDto) {
    try {
      const one = await this._findOne(id);
      one.quantity = updateProductOfferDto.quantity;
      
      return one.save().then((saved) => {
        return DataFormater.getProductOffer(saved);
      });
    } catch (error) {
      console.log('ProductOffer.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this._findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('ProductOffer.delete.error', error);
      throw error;
    }
  }

}
