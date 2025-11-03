import { Injectable } from '@nestjs/common';
import { UserSession } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionService {

    constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>
      ) { }

    async cleanExpiredSessions() {
        await this.userSessionRepository.delete({ validUntil: LessThan(new Date()) });
      }

    async deleteSessions(user: User) {
        await this.userSessionRepository.delete({ user: {id:user.id} });
      }
}
