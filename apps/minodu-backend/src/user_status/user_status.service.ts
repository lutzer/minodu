import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserStatusDto } from './dto/create-user_status.dto';
import { UpdateUserStatusDto } from './dto/update-user_status.dto';
import { UserStatus } from './entities/user_status.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { userStatus } from './entities/user_status.enum';

@Injectable()
export class UserStatusService {

  constructor(
    @InjectRepository(UserStatus)
    private userStatusRepository: Repository<UserStatus>
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

  async createStatuses() {
    try {
      const userState0 = await this.userStatusRepository.findOne({ where: { name: userStatus.ACTIVE } });
      if (!userState0) {
        const newUserState0 = new UserStatus();
        newUserState0.name = userStatus.ACTIVE;
        await newUserState0.save();
      }

      const userState1 = await this.userStatusRepository.findOne({ where: { name: userStatus.BLOCKED } });
      if (!userState1) {
        const newUserState1 = new UserStatus();
        newUserState1.name = userStatus.BLOCKED;
        await newUserState1.save();
      }
      
      return true;
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        return true;
      }
      console.log('UserStatus.create.default.error', error);
      return false;
    }
  }

  async defaultStatus() {
    return await this.userStatusRepository.findOne({ where: { name: userStatus.ACTIVE } });
  }

}
