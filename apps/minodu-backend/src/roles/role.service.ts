import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { userRole } from './entities/user_role.enum';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) { }

  create(createRoleDto: CreateRoleDto) {
    try {
      const role = new Role();
      role.name = createRoleDto.name.toUpperCase();
      return role.save();
    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        throw new ConflictException(`Le role utilisateur ( ${createRoleDto.name} ) existe déja !}`);
      }
      console.log('Role.create.error', error);
      throw error;
    }
  }

  findAll() {
    try {
      return this.roleRepository.find();
    } catch (error) {
      console.log('Role.all.error', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.roleRepository.findOne({ where: { id } });
      if (!one) {
        throw new NotFoundException();
      }
      return one;
    } catch (error) {
      console.log('Role.one.error', error);
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const one = await this.findOne(id);
      one.name = updateRoleDto.name;
      return one.save();
    } catch (error) {
      console.log('Role.update.error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      console.log('Role.delete.error', error);
      throw error;
    }
  }

  async createRoles() {
    try {
      const role0 = await this.roleRepository.findOne({ where: { name: userRole.ADMIN } });
      const role1 = await this.roleRepository.findOne({ where: { name: userRole.USER } });
      if (!role0) {
        const newRole0 = new Role();
        newRole0.name = userRole.ADMIN;
        await newRole0.save();
      }

      if (!role1) {
        const newRole1 = new Role();
        newRole1.name = userRole.USER;
        await newRole1.save();
      }

    } catch (error) {
      if (error.code === '11000' || error.code === '23505') {
        return true;
      }
      console.log('Role.create.default.error', error);
      return false;
    }
  }

  async defaultRole() {
    return await this.roleRepository.findOne({ where: { name: userRole.USER } });
  }

  async adminRole() {
    return await this.roleRepository.findOne({ where: { name: userRole.ADMIN } });
  }

}
