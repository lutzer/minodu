import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Product } from 'src/products/entities/product.entity';
import { ProductDemand } from './entities/demand.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { CreateProductDemandDto } from './dto/create-product-demand.dto';
import { UpdateProductDemandDto } from './dto/update-product-demand.dto';

@Injectable()
export class ProductDemandService {

  constructor(
    @InjectRepository(ProductDemand)
    private readonly productDemandRepository: Repository<ProductDemand>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDemandDto: CreateProductDemandDto) {
    try {
      const partner = await this.partnerRepository.findOne({ where: { id: createProductDemandDto.partnerId }})
      if (!partner) {
        throw new NotFoundException('Partenaire non trouvé !');
      }      

      const product = await this.productRepository.findOne({ where: { id: createProductDemandDto.productId } })
      if (!product) {
        throw new NotFoundException('Produit non trouvé !');
      }      

      const productDemand = new ProductDemand();
      productDemand.partner = partner;
      productDemand.product = product;
      productDemand.quantity = createProductDemandDto.quantity;
      productDemand.deadline = new Date(createProductDemandDto.deadline);

      return productDemand.save().then((saved) => {
        return DataFormater.getProductDemand(saved);
      });
    } catch (error) {
      console.log('ProductDemand.create.error', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.productDemandRepository.find({
        relations:{
          product:true,
          partner: true
      }
      });

      return data.map((productDemand) => {
        return { ...DataFormater.getProductDemand(productDemand) };
      });
    } catch (error) {
      console.log('ProductDemand.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.productDemandRepository.findOne({ 
        where: { id },
      relations:{
          product:true,
          partner:true
      }
    });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getProductDemand(one);;
    } catch (error) {
      console.log('ProductDemand.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.productDemandRepository.findOne({ 
        where: { id },
      relations:{
          product:true,
          partner: true
      }
    });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('ProductDemand.one.error', error);
      throw error;
    }
  }

  async findAllByProduct(productId: number) {
    try {
      const data = await this.productDemandRepository.find({ 
        where: { 
          product:{id:productId} 
        },
        relations:{
          product:true,
          partner:true
      } 
      });
      if (!data) {
        throw new NotFoundException();
      }
      
       return data.map((productDemand) => {
        return { ...DataFormater.getProductDemand(productDemand) };
      });
    } catch (error) {
      console.log('ProductDemand.byProduct.error', error);
      throw error;
    }
  }

  async findAllByPartner(partnerId: number) {
    try {
      const data = await this.productDemandRepository.find({ 
        where: { 
          partner:{id:partnerId} 
        },
        relations:{
          product:true,
          partner: true
      }
      });
      if (!data) {
        throw new NotFoundException();
      }
      return data.map((productDemand) => {
        return { ...DataFormater.getProductDemand(productDemand) };
      });
    } catch (error) {
      console.log('ProductDemand.byPartner.error', error);
      throw error;
    }
  }

  async update(id: number, updateProductDemandDto: UpdateProductDemandDto) {
    try {
      const one = await this._findOne(id);
      one.quantity = updateProductDemandDto.quantity;
      one.deadline = new Date(updateProductDemandDto.deadline);

      
      return one.save().then((saved) => {
        return DataFormater.getProductDemand(saved);
      });
    } catch (error) {
      console.log('ProductDemand.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this._findOne(id);
      return one.remove();
    } catch (error) {
      console.log('ProductDemand.delete.error', error);
      throw error;
    }
  }

}
