import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { ProductOffer } from './entities/product_offer.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProductOfferDto } from './dto/create-product-offer.dto';
import { UpdateProductOfferDto } from './dto/update-product-offer.dto';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ProductOfferService {

  constructor(
    @InjectRepository(ProductOffer)
    private readonly productOfferRepository: Repository<ProductOffer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly loggerService: LoggerService
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
      productOffer.quantity = createProductOfferDto.quantity;

      return productOffer.save().then((saved) => {
        this.loggerService.log('Product offer created successfully', ProductOfferService.name);
        return DataFormater.getProductOffer(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while creating product offer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.productOfferRepository.find({
        where: { isArchived: false },
        relations:{
          product:true,
          user: true
      }
      });

      return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product offers: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

  async findAllArchived() {
    try {
      const data = await this.productOfferRepository.find({
        where: { isArchived: true },
        relations:{
          product:true,
          user: true
      }
      });

      return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching archived product offers: ${error.message}`, ProductOfferService.name);
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
        this.loggerService.error(`Product offer not found with id: ${id}`, ProductOfferService.name);
        throw new NotFoundException('Offre non trouvée !');
      }

      this.loggerService.log(`Product offer fetched successfully with id: ${id}`, ProductOfferService.name);
      return DataFormater.getProductOffer(one);;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product offer: ${error.message}`, ProductOfferService.name);
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
        this.loggerService.error(`Product offer not found with id: ${id}`, ProductOfferService.name);
        throw new NotFoundException('Offre non trouvée !');
      }
      return one;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product offer: ${error.message}`, ProductOfferService.name);
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
        this.loggerService.error(`No product offers found for product with id: ${productId}`, ProductOfferService.name);
        throw new NotFoundException('Aucune offre trouvée pour ce produit !');
      }
      
       return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product offers by product: ${error.message}`, ProductOfferService.name);
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
        this.loggerService.error(`No product offers found for farmer with id: ${userId}`, ProductOfferService.name);
        throw new NotFoundException('Aucune offre trouvée pour ce producteur !');
      }
      return data.map((productOffer) => {
        return { ...DataFormater.getProductOffer(productOffer) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product offers by farmer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

  async archive(id: number){
    try{
      const one =  await this._findOne(id);

      if (one.isArchived){
        this.loggerService.error(`Attempted to archive a product offer that is already archived: ${id}`, ProductOfferService.name);
        throw new Error('Offre déjà archivée');
      }

      one.isArchived = true;
      one.archivedAt = new Date();

      return one.save().then((saved)=>{
        this.loggerService.log('Product offer archived successfully', ProductOfferService.name);
        return DataFormater.getProductOffer (saved);
      });
    } catch (error){
      this.loggerService.error(`Error occurred while archiving product offer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

   async unarchive(id: number) {
    try {
      const one = await this._findOne(id);
      
      if (!one.isArchived) {
        this.loggerService.error(`Attempted to unarchive a product offer that is not archived: ${id}`, ProductOfferService.name);
        throw new Error('Cet offre n\'est pas archivée');
      }

      one.isArchived = false;
      one.archivedAt = null;

      return one.save().then((saved) => {
        this.loggerService.log('Product offer unarchived successfully', ProductOfferService.name);
        return DataFormater.getProductOffer(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while unarchiving product offer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

  async update(id: number, updateProductOfferDto: UpdateProductOfferDto) {
    try {
      const one = await this._findOne(id);
      one.quantity = updateProductOfferDto.quantity;
      
      return one.save().then((saved) => {
        this.loggerService.log('Product offer updated successfully', ProductOfferService.name);
        return DataFormater.getProductOffer(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while updating product offer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this._findOne(id);
      return one.softRemove();
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting product offer: ${error.message}`, ProductOfferService.name);
      throw error;
    }
  }

}
