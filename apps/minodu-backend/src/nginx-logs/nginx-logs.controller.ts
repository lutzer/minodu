import { Body, Controller, Delete, Get, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { NginxLogsService } from './nginx-logs.service';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags("Nginx Logs")
@ApiBearerAuth()
@Controller({
  path: 'nginx-logs',
  version: "1"
})
export class NginxLogsController {
  constructor(
    private readonly nginxLogsService: NginxLogsService
  ) { }
  
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Read Nginx Logs", description: "Read raw Nginx log files" })
  @Get()
  async readNginxLogs(
    @Query('type') type: string = 'default',
    @Query('lines') lines: number = 500,
    @Res() res: Response
  ) {
    try {
      const logContent = await this.nginxLogsService.readRawLogs(
        type,
        Number(lines),
      );
      
      // Return as plain text
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(logContent);
      
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }
  
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Empty logs files", description: "Empty all logs files" })
  @Delete()
  emptyLogsFiles() {
    return this.nginxLogsService.emptyLogFile();
  }

}
