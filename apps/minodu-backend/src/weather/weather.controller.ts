import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { WeatherService } from './weather.service';
import { SyncWeatherDto } from './dto/sync-weather.dto';

@ApiTags("Weather")
@Public()
@Controller({
  path: 'weather',
  version: "1"
})
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService
  ) { }

  @ApiOperation({ summary: "Weather list", description: "All weather list" })
  @Get()
  findAll() {
    return this.weatherService.findAll();
  }

  @ApiOperation({ summary: "Current weather", description: "current weather details" })
  @Get("current")
  findCurrent() {
    return this.weatherService.findCurrent();
  }

  @ApiOperation({ summary: "Sync weather", description: "Sync weather from teleagriculture station" })
  @Patch()
  update(@Body() syncWeatherDto: SyncWeatherDto) {
    return this.weatherService.sync(syncWeatherDto);
  }

}
