import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import * as fse from 'fs-extra';
import { promisify } from 'util';
import { BaseConfig } from 'src/utils/common.util';
import { LoggerService } from 'src/logs/logger.service';

const execAsync = promisify(exec);

export interface BackupResult {
  success: boolean;
  message: string;
  backupPath?: string;
  hash?: string;
  size?: number;
  timestamp?: Date;
}

@Injectable()
export class BackupService {
  private readonly dumpFileName = 'db_dump.sql';
  private readonly backupFileName = 'minodu_backend_backup.zip';
  private readonly tempDir = BaseConfig.getFilePath(this.backupFileName);

  constructor(
    private readonly logger: LoggerService
  ) {
    // Ensure temp directory exists
    fse.ensureDirSync(this.tempDir);
  }

  /**
   * Create database dump and compress to zip
   */
  async createBackup(): Promise<BackupResult> {
    const timestamp = new Date();
    
    try {
      this.logger.log('Starting database backup process...');

      // Delete older backups
      await this.cleanOldBackups();

      // Create MySQL dump
      const dumpPath = await this.createDatabaseDump();

      // Compress temp folder to zip
      const backupPath = await this.compressTempFolder();

      // Generate hash
      const hash = await this.generateFileHash(backupPath);

      // Get file stats
      const stats = await fse.stat(backupPath);

      this.logger.log(`Backup created successfully: ${backupPath}`);

      return {
        success: true,
        message: 'Backup created successfully',
        backupPath: BaseConfig.getFileUrl(this.backupFileName),
        hash,
        size: stats.size,
        timestamp
      };

    } catch (error) {
      const errorMessage = error.message.replace(/mysqldump.*?-p.*?(\s|$)/gi, 'mysqldump [credentials hidden]');
      this.logger.error(`Backup failed: ${errorMessage}`);
      return {
        success: false,
        message: `Backup failed: ${errorMessage}`
      };
    }
  }

  /**
   * Delete older backup files
   */
  private async cleanOldBackups(): Promise<void> {
    try {
      const files = await fse.readdir(this.tempDir);
      
      for (const file of files) {
        if (file.endsWith('.zip') || file===this.dumpFileName) {
          const filePath = path.join(this.tempDir, file);
          await fse.remove(filePath);
          this.logger.log(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      this.logger.log(`Could not clean old backups: ${error.message}`);
    }
  }

  /**
   * Create MySQL database dump
   */
  private async createDatabaseDump(): Promise<string> {
    const dumpPath = path.join(this.tempDir, this.dumpFileName);

    // Get database configuration from environment variables
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'minodu',
    };

    // Define specific tables to backup
    const tablesToBackup = [
        'backend_user_status',
        'backend_role', 
        'backend_product_category',
        'backend_product',
        'backend_post_tag',
        'backend_post_resource',
        'backend_post_category',
        'backend_posts_tags',
        'backend_posts_resources',
        'backend_post'
    ];

    // Build mysqldump command
    const command = `mysqldump --skip-ssl -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.username} -p${dbConfig.password} ${dbConfig.database} ${tablesToBackup.join(' ')} > ${dumpPath}`;

    try {
      this.logger.log('Creating MySQL dump...');
      await execAsync(command);

      // Verify dump was created
      if (!fs.existsSync(dumpPath)) {
        throw new Error('MySQL dump file was not created');
      }

      const stats = await fse.stat(dumpPath);
      this.logger.log(`MySQL dump created: ${dumpPath} (${stats.size} bytes)`);

      return dumpPath;

    } catch (error) {
      this.logger.error(`Network dump failed: ${error.message}`);
        throw new Error(`Failed to create MySQL dump: ${error.message}`);
    }
  }

  /**
   * Compress temp folder to zip
   */
  private async compressTempFolder(): Promise<string> {
    return new Promise((resolve, reject) => {
      const backupPath = path.join(this.tempDir, this.backupFileName);
      const output = fs.createWriteStream(backupPath);
    
      // Define specific files and directories to include
      const itemsToBackup = [this.dumpFileName, 'audios/*', 'images/*', 'docs/*'];
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      output.on('close', () => {
        this.logger.log(`Zip archive created: ${backupPath} (${archive.pointer()} bytes)`);
        resolve(backupPath);
      });

      archive.on('error', (err) => {
        reject(new Error(`Zip creation failed: ${err.message}`));
      });

      archive.pipe(output);

      // Add all files from temp directory to zip
      itemsToBackup.forEach(pattern => {
          archive.glob(pattern, { cwd: this.tempDir });
      });
      // archive.glob('**/*', {
      //       cwd: this.tempDir,
      //       ignore: [this.backupFileName, 'minodu.sql', 'logs']
      //   });

      archive.finalize();
    });
  }

  /**
   * Generate SHA-256 hash for the backup file
   */
  private async generateFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(new Error(`Hash generation failed: ${err.message}`)));
    });
  }

}