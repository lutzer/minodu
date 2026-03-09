import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Product } from 'src/products/entities/product.entity';
import { ProductDemand } from './entities/demand.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { CreateProductDemandDto } from './dto/create-product-demand.dto';
import { UpdateProductDemandDto } from './dto/update-product-demand.dto';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ProductDemandService {

  constructor(
    @InjectRepository(ProductDemand)
    private readonly productDemandRepository: Repository<ProductDemand>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly loggerService: LoggerService
  ) { }

  async create(createProductDemandDto: CreateProductDemandDto) {
    try {
      const partner = await this.partnerRepository.findOne({ where: { id: createProductDemandDto.partnerId }})
      if (!partner) {
        this.loggerService.error(`Attempted to create product demand with partner ID ${createProductDemandDto.partnerId} but partner was not found`, ProductDemandService.name);
        throw new NotFoundException('Partenaire non trouvé !');
      }      

      const product = await this.productRepository.findOne({ where: { id: createProductDemandDto.productId } })
      if (!product) {
        this.loggerService.error(`Attempted to create product demand with product ID ${createProductDemandDto.productId} but product was not found`, ProductDemandService.name);
        throw new NotFoundException('Produit non trouvé !');
      }      

      const productDemand = new ProductDemand();
      productDemand.partner = partner;
      productDemand.product = product;
      productDemand.quantity = createProductDemandDto.quantity;
      productDemand.deadline = new Date(createProductDemandDto.deadline);
      productDemand.isArchived = false;

      return productDemand.save().then((saved) => {
        this.loggerService.log('Product demand created successfully', ProductDemandService.name);
        return DataFormater.getProductDemand(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while creating product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.productDemandRepository.find({
        where: { isArchived: false },
        relations: {
          product: true,
          partner: true
        }
      });

      return data.map((productDemand) => {
        return { ...DataFormater.getProductDemand(productDemand) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product demands: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async findAllArchived() {
    try {
      const data = await this.productDemandRepository.find({
        where: { isArchived: true },
        relations: {
          product: true,
          partner: true
        },
        order: {
          archivedAt: 'DESC'
        }
      });

      return data.map((productDemand) => {
        return { ...DataFormater.getProductDemand(productDemand) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching archived product demands: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.productDemandRepository.findOne({ 
        where: { id },
        relations: {
          product: true,
          partner: true
        }
      });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getProductDemand(one);
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.productDemandRepository.findOne({ 
        where: { id },
        relations: {
          product: true,
          partner: true
        }
      });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async findAllByProduct(productId: number) {
    try {
      const data = await this.productDemandRepository.find({ 
        where: { 
          product: { id: productId },
          isArchived: false
        },
        relations: {
          product: true,
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
      this.loggerService.error(`Error occurred while fetching product demands by product: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async findAllByPartner(partnerId: number) {
    try {
      const data = await this.productDemandRepository.find({ 
        where: { 
          partner: { id: partnerId },
          isArchived: false
        },
        relations: {
          product: true,
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
      this.loggerService.error(`Error occurred while fetching product demands by partner: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async archive(id: number) {
    try {
      const one = await this._findOne(id);
      
      if (one.isArchived) {
        throw new Error('Cette demande est déjà archivée');
      }

      one.isArchived = true;
      one.archivedAt = new Date();

      return one.save().then((saved) => {
        this.loggerService.log('Product demand archived successfully', ProductDemandService.name);
        return DataFormater.getProductDemand(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while archiving product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async unarchive(id: number) {
    try {
      const one = await this._findOne(id);
      
      if (!one.isArchived) {
        throw new Error('Cette demande n\'est pas archivée');
      }

      one.isArchived = false;
      one.archivedAt = null;

      return one.save().then((saved) => {
        this.loggerService.log('Product demand unarchived successfully', ProductDemandService.name);
        return DataFormater.getProductDemand(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while unarchiving product demand: ${error.message}`, ProductDemandService.name);
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
      this.loggerService.error(`Error occurred while updating product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this._findOne(id);
      return one.remove();
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting product demand: ${error.message}`, ProductDemandService.name);
      throw error;
    }
  }
}