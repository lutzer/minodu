import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NGINX_LOG_PATHS } from './constants';
import { promises as fs } from 'fs';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class NginxLogsService {

  constructor(
    private readonly logger: LoggerService
  ) { }

  private getLogPath(type: string = 'default'): string {
    switch (type) {
      case 'access':
        return NGINX_LOG_PATHS.ACCESS_LOG;
      case 'error':
        return NGINX_LOG_PATHS.ERROR_LOG;
      default:
        return NGINX_LOG_PATHS.DEFAULT_LOG;
    }
  }

  async readRawLogs(
    type: string = 'default',
    lines: number = 500
  ): Promise<string> {
    const logPath = this.getLogPath(type);

    try {
      // Check if file exists
      await fs.access(logPath);
      
      // Read entire file
      const fileContent = await fs.readFile(logPath, 'utf8');
      
      // Split into lines
      const allLines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      // Apply offset and limit
      const endIndex = Math.min(allLines.length, lines);
      const selectedLines = allLines.slice(0, endIndex);
      
      // Return raw text
      return selectedLines.join('\n');

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new HttpException(
          `Log file not found: ${logPath}`,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        `Error reading log file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async emptyLogFile(): Promise<{ success: boolean; message: string }> {
    const LOG_PATHS_LIST = [NGINX_LOG_PATHS.DEFAULT_LOG, NGINX_LOG_PATHS.ACCESS_LOG, NGINX_LOG_PATHS.ERROR_LOG];

    try {
      for (const logPath of LOG_PATHS_LIST) {
        // Check if file exists
        await fs.access(logPath);
        // Empty the file
        await fs.writeFile(logPath, '', 'utf8');
      }
      
      return {
        success: true,
        message: `All log files emptied successfully.`
      };

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new HttpException(
          `One or more log files not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        `Error emptying log file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
