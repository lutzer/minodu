import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    private readonly logger: LoggerService
  ) { }

  async findOne(id: number) {
    try {
      const one = await this.configurationRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      this.logger.error(`Error occurred while fetching configuration: ${error.message}`, ConfigurationService.name);
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
        const savedConfig = await one.save();
        this.logger.log('Configuration updated successfully', ConfigurationService.name);
        return savedConfig;
      }
    } catch (error) {
      this.logger.error(`Error occurred while updating configuration: ${error.message}`, ConfigurationService.name);
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
        this.logger.log('Default configuration created successfully', ConfigurationService.name);
      }
      return true;

    } catch (error) {
      this.logger.error(`Error occurred while creating default configuration: ${error.message}`, ConfigurationService.name);
      return false;
    }
  }

}
