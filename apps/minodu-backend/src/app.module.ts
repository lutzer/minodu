import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { RolesModule } from './roles/role.module';
import { UserStatusModule } from './user_status/user_status.module';
import { SessionModule } from './session/session.module';
import { LoggerModule } from './logs/logger.module';
import { PostModule } from './posts/post.module';
import { PostTagModule } from './post_tags/post-tag.module';
import { PostCategoryModule } from './post_categories/post-category.module';
import { PostResourceModule } from './post_resources/post-resource.module';
import { ProductsModule } from './products/product.module';
import { ProductCategoriesModule } from './product_categories/product_category.module';
import { WeatherModule } from './weather/weather.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProductDemandModule } from './product_demands/demand.module';
import { ProductOfferModule } from './product_offers/product_offer.module';
import { PartnerModule } from './partners/partner.module';
import { BackupModule } from './backup/backup.module';
import { NginxLogsModule } from './nginx-logs/nginx-logs.module';
import { ForumModule } from './forum/forum.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // Temps de vie en millisecondes (1 min)
      limit: 100,   // Nombre max de requêtes par utilisateur
    }]),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      logger: 'advanced-console',
      logging: ['error'],
      port: parseInt(process.env.DB_PORT, 10),
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      synchronize: true,
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      connectorPackage: 'mysql2',
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('access_token', req.session);
        },
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    UserStatusModule,
    SessionModule,
    PostModule,
    PostTagModule,
    PostCategoryModule,
    PostResourceModule,
    ProductsModule,
    ProductCategoriesModule,
    WeatherModule,
    ConfigurationModule,
    LoggerModule,
    PartnerModule,
    ProductDemandModule,
    ProductOfferModule,
    BackupModule,
    NginxLogsModule,
    ForumModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
   {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
