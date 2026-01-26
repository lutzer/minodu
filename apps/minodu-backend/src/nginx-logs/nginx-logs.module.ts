import { Module } from '@nestjs/common';
import { NginxLogsController } from './nginx-logs.controller';
import { NginxLogsService } from './nginx-logs.service';

@Module({
  controllers: [NginxLogsController],
  providers: [NginxLogsService],
  exports: [NginxLogsService]
})
export class NginxLogsModule {}
