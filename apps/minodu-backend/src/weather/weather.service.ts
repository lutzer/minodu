import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from './entities/weather.entity';
import { SyncWeatherDto } from './dto/sync-weather.dto';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class WeatherService {

  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
    private readonly aiService:AiService
  ) { }

  async sync(syncWeatherDto: SyncWeatherDto) {
    //pull data from teleagriculture
    try {
      let weather = new Weather();
      if(syncWeatherDto){
        weather.temperature = syncWeatherDto.temp;
        weather.temperature1 = syncWeatherDto.temp1;
        weather.humidity = syncWeatherDto.hum;
        weather.humidity1 = syncWeatherDto.hum1;
        weather.pressure = syncWeatherDto.press;
        weather.luminosity = syncWeatherDto.lux;
        weather.ambient = syncWeatherDto.ambient;
        weather.co = syncWeatherDto.CO;
        weather.no2 = syncWeatherDto.NO2;
        weather.description = await this.aiService.interpretWeather(JSON.stringify(syncWeatherDto))
        weather.save();
      }

    } catch (error) {
      // throw new ConflictException(`La donnée méteo existe déja !}`);
      throw error;
    }
  }

  findAll() {
    try {
      return this.weatherRepository.find();
    } catch (error) {
      console.log('Weather.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.weatherRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('Weather.one.error', error);
      throw error;
    }
  }

  async findCurrent() {
    try {
      const latest = await this.weatherRepository.find({order:{createdAt:'DESC'}, take:1});
  
      if (!latest) {
        throw new NotFoundException('No weather data found');
      }

      return latest;
    } catch (error) {
      console.log('Weather.one.error', error);
      throw error;
    }
  }

  async removeAll() {
    try {
      await this.weatherRepository.clear();
      return { message: 'All records have been deleted successfully.' };
    } catch (error) {
      console.log('Weather.delete.error', error);
      throw error;
    }
  }

}
