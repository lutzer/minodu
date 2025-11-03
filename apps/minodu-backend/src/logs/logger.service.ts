import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize:5120
    }),

    ],
  });

  log(message: string, context?: string) {
    this.logger.log('info', message, { context });
  }

  error(message: string, context?: string) {
    this.logger.log('error', message, { context });
  }

  trace(message: string, error?: Error, context?: string) {
    this.logger.error(message, { stack: error?.stack, context });
  }
}