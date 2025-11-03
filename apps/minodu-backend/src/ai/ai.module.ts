import { AiService } from './ai.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}