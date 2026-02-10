import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UserStatusService } from './user_status/user_status.service';
import { RolesService } from './roles/role.service';
import { UsersService } from './users/user.service';
import { ConfigurationService } from './configuration/configuration.service';
import { Public } from './auth/decorators/public.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BaseConfig } from './utils/common.util';
import { PostService } from './posts/post.service';
import { ProductsService } from './products/product.service';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userStatusService: UserStatusService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly configurationService: ConfigurationService,
    private readonly postService: PostService,
    private readonly productsService: ProductsService,
  ) {
    this.initializeDefaultData();
  }

  async initializeDefaultData() {
    await this.userStatusService.createDefaultStatuses();
    await this.rolesService.createDefaultRoles();
    await this.usersService.createDefaultAdmin();
    await this.configurationService.createDefaultConfiguration();
  }

  /**
   * 
   * Downloads a file specified by its name in the URL.
   * 
   * @param name - The name of the file to be downloaded.
   * @param res - The response object used to send the file to the client.
   * @returns The file is sent back to the client.
   */
  @SkipThrottle()
  @Public()
  @ApiOperation({
    summary: "Download a file",
    description: "Fetches the URL of the specified file (e.g., image) and returns it for download."
  })
  @ApiOkResponse({
    description: 'Success: The file was served successfully.'
  })
  @Get('files/:file')
  async getFile(@Param('file') name: string, @Res() res: any): Promise<object> {
    try {
      const path = BaseConfig.getFilePath(name);
      return res.sendFile(name, { root: path });
    } catch (error) {
      console.log('ERROR::AppController.getFile', error.message);
    }
  }

  @ApiOperation({ summary: "Default data for figma", description: "All data for figma" })
  @Get()
  async findAll() {
    return {
      products: await this.productsService.findAll(),
      posts: await this.postService.findAll(),
    }
  }
}
