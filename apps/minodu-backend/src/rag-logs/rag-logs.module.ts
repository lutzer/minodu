import { Module } from '@nestjs/common';
import { RagLogsController } from './rag-logs.controller';
import { RagLogsService } from './rag-logs.service';

@Module({
  controllers: [RagLogsController],
  providers: [RagLogsService],
  exports: [RagLogsService]
})
export class RagLogsModule {}
