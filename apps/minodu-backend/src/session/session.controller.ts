import { Controller, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';

@ApiTags("Session")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'sessions',
  version: "1"
})
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
}
