import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserStatus } from 'src/user_status/entities/user_status.entity';
import { RolesModule } from 'src/roles/role.module';
import { UserStatusModule } from 'src/user_status/user_status.module';
import { ProductsModule } from 'src/products/product.module';
import { PostModule } from 'src/posts/post.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { PostCategoryModule } from 'src/post_categories/post-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      UserStatus,
      User,
    ]),
    RolesModule,
    UserStatusModule,
    ProductsModule,
    ConfigurationModule,
    PostCategoryModule,
    forwardRef(() => PostModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
