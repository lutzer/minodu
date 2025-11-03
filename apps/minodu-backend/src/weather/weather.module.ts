import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { AiService } from 'src/ai/ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Weather,
    ])
  ],
  controllers: [WeatherController],
  providers: [WeatherService, AiService],
  exports: [WeatherService]
})
export class WeatherModule {}
