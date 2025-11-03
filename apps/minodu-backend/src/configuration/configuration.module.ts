import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './entities/configuration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Configuration,
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService]
})
export class ConfigurationModule {}
