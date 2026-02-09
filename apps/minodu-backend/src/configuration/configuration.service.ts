import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>
  ) { }

  async findOne(id: number) {
    try {
      const one = await this.configurationRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('Configuration.one.error', error);
      throw error;
    }
  }

  async update(updateConfigurationDto: UpdateConfigurationDto) {
    try {
      const one = await this.findOne(1);
      if(one){
        one.community_name = updateConfigurationDto.name;
        one.community_introduction = updateConfigurationDto.intro;
        one.adresse = updateConfigurationDto.adresse;
        one.location = updateConfigurationDto.location;
        one.whatsapp_link = updateConfigurationDto.whatsappLink;
        one.station_link = updateConfigurationDto.stationLink;
        return one.save();
      }
    } catch (error) {
      console.log('Configuration.update.error', error);
      throw error;
    }
  }

  async createDefaultConfiguration() {
    try {
      const config = await this.configurationRepository.findOne({ where: { id:1} });
      if (!config) {
        const newConfig = new Configuration();
        newConfig.id = 1;
        newConfig.community_name = "default"
        newConfig.community_introduction = "default"
        newConfig.adresse = "default"
        newConfig.location = "0.00,0.00"
        newConfig.whatsapp_link = null
        newConfig.station_link = null
        await this.configurationRepository.save(newConfig);
      }

    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        return true;
      }
      console.log('Configuration.create.default.error', error);
      return false;
    }
  }

}
