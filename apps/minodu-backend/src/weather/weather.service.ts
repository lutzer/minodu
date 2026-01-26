import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from './entities/weather.entity';
import { SyncWeatherDto } from './dto/sync-weather.dto';
import { AiService } from 'src/ai/ai.service';
import { Workbook } from 'exceljs';
import { Response } from 'express';

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
        weather.wind_direction = syncWeatherDto.wind_dir;
        weather.wind_speed = syncWeatherDto.wind_spd;
        weather.indice_uv = syncWeatherDto.uv;
        weather.battery = syncWeatherDto.battery;
        weather.time = syncWeatherDto.time ? syncWeatherDto.time : new Date().toISOString();
        weather.description = await this.aiService.interpretWeather(JSON.stringify(syncWeatherDto))
        weather.save();
      }

    } catch (error) {
      // throw new ConflictException(`La donnée méteo existe déja !}`);
      throw error;
    }
  }

  async download(res: Response) {
     const workbook = new  Workbook();
     const worksheet = workbook.addWorksheet('Les données méteo');

    try{
      // Define columns in the Excel file
      const columns = [
        { header: 'ID', key: 'id', width: 5 },
        { header: 'temp', key: 'temp', width: 15 },
        { header: 'temp1', key: 'temp1', width: 15 },
        { header: 'hum', key: 'hum', width: 15 },
        { header: 'hum1', key: 'hum1', width: 15 },
        { header: 'press', key: 'press', width: 15 },
        { header: 'lux', key: 'lux', width: 15 },
        { header: 'ambient', key: 'ambient', width: 15 },
        { header: 'CO', key: 'CO', width: 15 },
        { header: 'NO2', key: 'NO2', width: 15 },
        { header: 'wind_dir', key: 'wind_dir', width: 15 },
        { header: 'wind_spd', key: 'wind_spd', width: 15 },
        { header: 'uv', key: 'uv', width: 15 },
        { header: 'battery', key: 'battery', width: 15 },
        { header: 'time', key: 'time', width: 20 },
        { header: 'description', key: 'description', width: 50 },
      ];

      // Appliquer les colonnes à la feuille Excel
      worksheet.columns = columns;

      const data = await this.findAll();

      // Ajouter les lignes de données
      var i = 0;

      const rows = await Promise.all(data.map(async (weather) => {
  
          // row data
          const row: any = {
            id: i+1,
            temp: weather.temperature,
            temp1: weather.temperature1,
            hum: weather.humidity,
            hum1: weather.humidity1,
            press: weather.pressure,
            lux: weather.luminosity,
            ambient: weather.ambient,
            CO: weather.co,
            NO2: weather.no2,
            wind_dir: weather.wind_direction,
            wind_spd: weather.wind_speed,
            uv: weather.indice_uv,
            battery: weather.battery,
            time: new Date(weather.time).toLocaleString('fr-FR'),
            description: weather.description,
          };
          i++;
          return row;
        }
      ));

      // Ajouter toutes les lignes à la feuille Excel
      worksheet.addRows(rows.filter(row => row !== null));

      // Generer le fichier Excel en memoire
      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="weather_data.xlsx"`);
      return res.send(buffer);

    }catch (error) {
      console.log('Weather.download.error', error);
      throw error;
    }
  }

  findAll(limit?:number) {
    try {
      return this.weatherRepository.find({ take: limit });
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
