import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserStatusDto } from './dto/create-user_status.dto';
import { UpdateUserStatusDto } from './dto/update-user_status.dto';
import { UserStatus } from './entities/user_status.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { userStatus } from './entities/user_status.enum';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class UserStatusService {

  constructor(
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
    private readonly loggerService: LoggerService
  ) { }

  create(createUserStatusDto: CreateUserStatusDto) {
    try {
      const userState = new UserStatus();
      userState.name = createUserStatusDto.name.toUpperCase();
      return userState.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`Le statut d'utilisateur ( ${createUserStatusDto.name} ) existe déja !}`);
      }
      console.log('UserStatus.create.error', error);
      throw error;
    }
  }

  findAll() {
    try {
      return this.userStatusRepository.find();
    } catch (error) {
      console.log('UserStatus.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.userStatusRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('UserStatus.one.error', error);
      throw error;
    }
  }

  async findByName(name: string) {
    return await this.userStatusRepository.findOne({ where: { name: name } });
  }

  async update(id: number, updateUserStatusDto: UpdateUserStatusDto) {
    try {
      const one = await this.findOne(id);
      if (updateUserStatusDto.name) one.name = updateUserStatusDto.name.toUpperCase();
      return one.save();
    } catch (error) {
      console.log('UserStatus.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('UserStatus.delete.error', error);
      throw error;
    }
  }

  async createDefaultStatuses() {
    const rolesToCreate = [
      { name: userStatus.ACTIVE },
      { name: userStatus.BLOCKED },
    ];

    try {
      // Upsert will insert new roles or skip/update if they exist
      await this.userStatusRepository.upsert(rolesToCreate, ['name']);
      return true;
    } catch (error) {
      this.loggerService.error(error, UserStatusService.name);
      return false;
    }
  }

  async defaultStatus() {
    return await this.userStatusRepository.findOne({ where: { name: userStatus.ACTIVE } });
  }

}
