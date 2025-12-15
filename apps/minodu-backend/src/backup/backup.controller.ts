import { 
  Controller, 
  Get, 
  Post, 
  Res, 
  HttpStatus, 
  StreamableFile,
  Header 
} from '@nestjs/common';
import { Response } from 'express';
import { BackupService, BackupResult } from './backup.service';
import * as fs from 'fs';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Bachup")
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * Create a new backup
   */
  @ApiOperation({ summary: "Create backup", description: "Create the system files & db dump backup" })
  @Public()
  @Post('create')
  async createBackup(): Promise<{ success: boolean; data: BackupResult }> {
    const result = await this.backupService.createBackup();
    return {
      success: result.success,
      data: result
    };
  }
}