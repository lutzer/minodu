import { Controller, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags("Session")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({
  path: 'sessions',
  version: "1"
})
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
}
