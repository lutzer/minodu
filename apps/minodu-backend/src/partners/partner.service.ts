import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFormater } from '../utils/data.formatter'
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {

  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) { }

  create(createPartnerDto: CreatePartnerDto) {
    try {
      const partner = new Partner();
      partner.name = createPartnerDto.name.toUpperCase();
      partner.adresse = createPartnerDto.adresse;
      partner.phone = createPartnerDto.phone;
      return partner.save();
    } catch (error) {
      console.log('Partner.create.error', error);
      throw new ConflictException(`Le partenaire ( ${createPartnerDto.name} ) existe déja !}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const allPartners = await this.partnerRepository.find();
      return allPartners.map((partner) => {
        return {
          ...DataFormater.getPartner(partner)
        }
      })
    } catch (error) {
      console.log('Partner.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.partnerRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('Partner.one.error', error);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.partnerRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return DataFormater.getPartner(one);
    } catch (error) {
      console.log('Partner.one.error', error);
      throw error;
    }
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    try {
      const one = await this.findOne(id);
      one.name = updatePartnerDto.name;
      one.adresse = updatePartnerDto.adresse;
      one.phone = updatePartnerDto.phone;
      return one.save();
    } catch (error) {
      console.log('Partner.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
  try {
    // Load partner with their demands to check for dependencies
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: {
        productDemands:true
      }
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Check if partner has any associated product demands
    if (partner.productDemands?.length > 0) {
      throw new BadRequestException(
        `Impossible de supprimer le partenaire ${partner.name} car il/elle a ${partner.productDemands.length} demande(s) de produit dans le système.`
      );
    }

    return await partner.softRemove();
  } catch (error) {
    console.error(`Failed to delete partner ID ${id}:`, error.message);
    throw error;
  }
}

}
