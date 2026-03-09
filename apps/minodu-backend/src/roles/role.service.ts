import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { userRole } from './entities/user_role.enum';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly loggerService: LoggerService
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = new Role();
      role.name = createRoleDto.name.toUpperCase();
      const res = await role.save();
      this.loggerService.log('Role created successfully', RolesService.name);
      return res;
    } catch (error) {
        this.loggerService.error(`Error occurred while creating role: ${error.message}`, RolesService.name);
        throw new ConflictException(`Le role utilisateur ( ${createRoleDto.name} ) existe déja !}`);
    }
  }

  findAll() {
    try {
      return this.roleRepository.find();
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching roles: ${error.message}`, RolesService.name);
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
      this.loggerService.error(`Error occurred while fetching role: ${error.message}`, RolesService.name);
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const one = await this.findOne(id);
      one.name = updateRoleDto.name;
      return one.save();
    } catch (error) {
      this.loggerService.error(`Error occurred while updating role: ${error.message}`, RolesService.name);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id);
      return one.softRemove();
    } catch (error) {
      this.loggerService.error(`Error occurred while removing role: ${error.message}`, RolesService.name);
      throw error;
    }
  }

  async createDefaultRoles() {
    const rolesToCreate = [
      { name: userRole.ADMIN },
      { name: userRole.USER },
    ];

    try {
      // Upsert will insert new roles or skip/update if they exist
      await this.roleRepository.upsert(rolesToCreate, ['name']);
      return true;
    } catch (error) {
      this.loggerService.error(`Error occurred while creating default roles: ${error.message}`, RolesService.name);
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
