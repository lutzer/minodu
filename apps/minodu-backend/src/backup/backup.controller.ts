import { 
  Controller, 
  Get} from '@nestjs/common';
import { BackupService, BackupResult } from './backup.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags("Backup")
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * Create a new backup
   */
  @Public()
  @ApiOperation({ summary: "Create backup", description: "Create the system files & db dump backup" })
  @Get('create')
  async createBackup(): Promise<{ success: boolean; data: BackupResult }> {
    const result = await this.backupService.createBackup();
    return {
      success: result.success,
      data: result
    };
  }
}