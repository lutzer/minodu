import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/user.module';
import { RolesService } from 'src/roles/role.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserStatusService } from 'src/user_status/user_status.service';
import { UserStatus } from 'src/user_status/entities/user_status.entity';
import { User } from 'src/users/entities/user.entity';
import { ClsModule } from 'nestjs-cls';
import { SessionService } from 'src/session/session.service';
import { UserSession } from 'src/session/entities/session.entity';
import { LoggerService } from 'src/logs/logger.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      expandVariables: true,
    }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30 days' },
    }),
    TypeOrmModule.forFeature([
      Role,
      User,
      UserStatus,
      UserSession
    ]),
    ClsModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RolesService,
    UserStatusService,
    SessionService,
    LoggerService
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule { }
