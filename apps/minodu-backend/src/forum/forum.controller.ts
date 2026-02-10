import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from 'src/roles/entities/user_role.enum';
import { ForumService } from './forum.service';

@ApiTags("Forum")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({
  path: 'forum',
  version: "1"
})
export class ForumController {
  constructor(
    private readonly forumService: ForumService,
  ) { }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Forum list", description: "All forum list" })
  @Get()
  findAll() {
    return this.forumService.findAll();
  }

  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: "Remove forum entry", description: "Remove the given forum entry" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumService.remove(+id);
  }
}
