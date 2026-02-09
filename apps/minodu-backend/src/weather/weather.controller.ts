import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { WeatherService } from './weather.service';
import { SyncWeatherDto } from './dto/sync-weather.dto';
import { Throttle } from '@nestjs/throttler';

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
  findAll(@Query('limit') limit: number = 500) {
    return this.weatherService.findAll(limit);
  }

  @ApiOperation({ summary: "Current weather", description: "current weather details" })
  @Get("current")
  findCurrent() {
    return this.weatherService.findCurrent();
  }

  @ApiOperation({ summary: "Sync weather", description: "Sync weather from teleagriculture station" })
  @Post()
  update(@Body() syncWeatherDto: SyncWeatherDto) {
    return this.weatherService.sync(syncWeatherDto);
  }
  
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 tentatives par 10 minute
  @Public()
  @ApiOperation({
    summary: "Download weather data into sheet",
    description: "Download weather data from the system into sheet"
  })
  @Get('download')
  async downloadWeather(@Res() res: any): Promise<object> {
      return this.weatherService.download(res);
  }

}
