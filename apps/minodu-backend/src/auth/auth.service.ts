import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/user.service';
import { RolesService } from '../roles/role.service';
import { UserStatusService } from '../user_status/user_status.service';
import { User } from '../users/entities/user.entity';
import { UserSession } from '../session/entities/session.entity';
import { SignUpDto } from './dto/signup.dto';
import { DataFormater } from '../utils/data.formatter';
import { SessionService } from 'src/session/session.service';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly rolesService: RolesService,
    private userStatusService: UserStatusService,
    private readonly cls: ClsService,
    private readonly sessionService: SessionService,
    private readonly logger: LoggerService
  ) { }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(phone: string, password: string): Promise<any> {
    this.logger.log(`Tentative d'authentification de ${phone}`, 'AuthController');
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      this.logger.log(`Authentification de ${phone}, refusée. Le numero de télephone est invalide.`, 'AuthController');
      throw new UnauthorizedException('Numéro de télephone ou mot de passe invalide.');
    }

    const isValidPwd = await user.validatePassword(password);

    if (!isValidPwd) {
      this.logger.log(`Authentification de ${phone}, refusée. Le mot de passe est invalide.`, 'AuthController');
      throw new UnauthorizedException('Numéro de télephone ou mot de passe invalide.');
    }

    if (user.status.name !== (await this.userStatusService.defaultStatus()).name) {
      this.logger.log(`Authentification de ${phone}, refusée. le compte utilisateur est bloqué`, 'AuthController');
      throw new UnauthorizedException('Ce compte utilisateur est bloqué.');
    }

    user.lastConnexion = new Date();
    await user.save();

    const payload = {
      id: user.id,
      phone: user.phone,
      role: user?.role?.name,
    };
    const access_token = await this.jwtService.signAsync(payload);
    await this.cls.set('access_token', access_token);
    await this.addSession(access_token, user);
    this.logger.log(`Authentification de ${phone}, réussie.`, 'AuthController');
    return { access_token, ...DataFormater.getUser(user) };
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      return await this.register(signUpDto).then(async (res) => {
        if (res) {
          const { phone, password } = signUpDto
          return await this.signIn(phone, password);
        }
      });
    } catch (error) {
      console.log('signUp-Err', error);
      throw error;
    }
  }

  async register(signUpDto: SignUpDto) {
    const { fullName, phone, gender, password } = signUpDto;
    try {
      const defaultRole = await this.rolesService.defaultRole();
      const defaultState = await this.userStatusService.defaultStatus(); 

      const user = new User();
      user.fullname = fullName;
      user.gender = gender
      user.phone = phone;
      user.role = defaultRole;
      user.status = defaultState;
      const salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, salt);

      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });

    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`Un compte est déjà enregistré avec le telephone ${phone} !`);
      }
      throw error;
    }
  }


  private async addSession(token: string, user: User) {
    try {
      await this.sessionService.cleanExpiredSessions();
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );
      const session = new UserSession();
      session.token = token;
      session.user = user;
      session.validUntil = new Date(payload.exp * 1000);
      session.finishedAt = new Date(payload.exp * 1000);
      await session.save();
    } catch (error) {
      console.log('addSession-Err', error);
      throw error;
    }
  }

  async logout(user: User) {
    try {
      await this.sessionService.deleteSessions(user);
    } catch (error) {
      console.log('clearSessions-Err', error);
      throw error;
    }
  }

}
