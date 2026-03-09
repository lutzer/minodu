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
    lines: number
  ): Promise<string> {
    const logPath = this.getLogPath(type);

    if(!lines || isNaN(lines) || lines <= 0) {
      lines = 500; // Default to 500 lines
    }

    try {
      // Check if file exists
      await fs.access(logPath);
      
      const fileContent = await fs.readFile(logPath, 'utf8');
      
      const allLines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      // Apply offset and limit
      const endIndex = Math.min(allLines.length, lines);
      const selectedLines = allLines.slice(0, endIndex);
      
      // Return raw text
      return selectedLines.join('\n');

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new HttpException(
          `Fichier de log non trouvé: ${logPath}`,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        `Erreur lors de la lecture du fichier de log : ${error.message}`,
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
        message: `Logs nettoyés avec succès.`
      };

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new HttpException(
          `Un ou plusieurs fichiers de log sont introuvables.`,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        `Erreur lors du nettoyage des logs : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
