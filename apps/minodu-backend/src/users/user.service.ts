import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  UpdatePwdDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { DataFormater } from '../utils/data.formatter';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserStatus } from 'src/user_status/entities/user_status.entity';
import { RolesService } from 'src/roles/role.service';
import { UserStatusService } from 'src/user_status/user_status.service';
import { ProductsService } from 'src/products/product.service';
import { PostService } from 'src/posts/post.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { userRole } from 'src/roles/entities/user_role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserStatus)
    private userStatusRepository: Repository<UserStatus>,
    private readonly rolesService: RolesService,
    private readonly userStatusService: UserStatusService,
    private readonly configurationService: ConfigurationService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly productsService: ProductsService,
    private readonly loggerService: LoggerService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { fullName, phone, gender, password, isContactPerson } = createUserDto;
    try {
      const defaultRole = await this.rolesService.defaultRole();
      const defaultState = await this.userStatusService.defaultStatus(); 

      const user = new User();
      user.fullname = fullName;
      user.gender = gender
      user.phone = phone;
      user.role = defaultRole;
      user.status = defaultState;
      user.isContactPerson = [true, 'true', 1, '1'].includes(isContactPerson);
      const salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, salt);

      return user.save().then((saved) => {
        this.loggerService.log('User created successfully', UsersService.name);
        if(user.isContactPerson!)
          this.updateContactPerson(saved.id)
        return DataFormater.getUser(saved);
      });

    } catch (error) {
      this.loggerService.error(`Error occurred while creating user: ${error.message}`, UsersService.name);
        throw new ConflictException(`Un compte est déjà enregistré avec le telephone ${phone} !`);
    }
  }

  async getAdminDashboard(userId: number) {
    try {
      const user = await this._findOne(userId);
      const config = await this.configurationService.findOne(1);

    return {
      lastConnexion: user.lastConnexion,
      communityName: config.community_name,
      postsCount: await this.postService.count(),
      productsCount: await this.productsService.count(),
      usersCount: await this.count(),
      posts: await this.postService.findAll(),
      user: user
    }

    } catch (error) {
      this.loggerService.error(`Error occurred while fetching admin dashboard data: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this.userRepository.count({
        where:{
          role:{
            name:userRole.USER
          }
        }
      });
      return count;
    } catch (error) {
      this.loggerService.error(`Error occurred while counting users: ${error.message}`, UsersService.name);
      throw new Error(`Échec de la récupération du nombre d'utilisateur inscrits : ${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        relations: {
          role: true,
          status: true,
        },
        order: {
          createdAt: "DESC",
        }
      });
      return users.map((user) => {
        return { ...DataFormater.getUser(user) };
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching users: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.userRepository.findOne({
        where: { id },
        relations: {
          role: true,
          status: true
        },
      });
      if (!one) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return one;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching user: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async _findOne(id: number) {
    try {
      const one = await this.userRepository.findOne({
        where: { id },
        relations: {
          role: true,
          status: true
        },
      });
      if (!one) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return { ...DataFormater.getUser(one)};
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching user: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async findByPhone(phone: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phone: phone },
        relations: {
          role: true,
          status: true
        },
      });
      if (!user) {
        this.loggerService.error(`User not found with phone: ${phone}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return user;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching user by phone: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async findContactPerson() {
    try {
      const user = await this.userRepository.findOne({
        where: { isContactPerson:true },
        relations: {
          role: true,
          status: true
        },
      });
      if (!user) {
        this.loggerService.error(`Contact person not found`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return DataFormater.getUser(user);
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching contact person: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async updateUserRole(id: number, idRole: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      const role = await this.roleRepository.findOne({
        where: { id: idRole },
      });
      if (!role) {
        this.loggerService.error(`Role not found with id: ${idRole}`, UsersService.name);
        throw new NotFoundException('Role utilisateur non trouvé !');
      }
      user.role = role;
      return user.save().then((saved) => {
        this.loggerService.log(`User role updated successfully (User ID: ${id}, Role ID: ${idRole})`, UsersService.name);
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while updating user role: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async updateUserStatus(id: number, idStuatus: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      const userState = await this.userStatusRepository.findOne({
        where: { id: idStuatus},
      });
      if (!userState) {
        this.loggerService.error(`User status not found with id: ${idStuatus}`, UsersService.name);
        throw new NotFoundException('Etat d\'utilisateur non trouvé !');
      }
      user.status = userState;
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while updating user status: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async updateContactPerson(userId: number) {
    await this.userRepository.update(
      { id: Not(userId) }, // WHERE
      { isContactPerson: false }    // SET
    );
  }

  async deleteUser(id) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }

      return user.softRemove().then((saved) => {
        this.loggerService.log(`User deleted successfully (User ID: ${id})`, UsersService.name);
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting user: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async updateCurrentUser(updateUserDto: UpdateUserDto, currentUser) {
    try {
      const { fullName, gender, phone } = updateUserDto;
      const user = await this.userRepository.findOne({
        where: { id: currentUser.id },
      });
      if (!user) {
        this.loggerService.error(`User not found with id: ${currentUser.id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      if (fullName) user.fullname = fullName;
      if (phone) user.phone = phone;
      if (gender) user.gender = gender;
      return user.save().then((saved) => {
        this.loggerService.log('Current user updated successfully', UsersService.name);
         if(user.isContactPerson)
          this.updateContactPerson(saved.id)
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while updating current user: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const { fullName, gender, phone, isContactPerson } = updateUserDto;
      const user = await this.userRepository.findOne({
        where: { 
          id: parseInt(userId),
          // role:{name:userRole.USER}
         },
      });
      if (!user) {
        this.loggerService.error(`User not found with id: ${userId}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé ou impossible de le modifier !');
      }
      if (fullName) user.fullname = fullName;
      if (phone) user.phone = phone;
      if (gender) user.gender = gender;
      user.isContactPerson = [true, 'true', 1, '1'].includes(isContactPerson);
      return user.save().then((saved) => {
        this.loggerService.log('User updated successfully', UsersService.name);
         if(user.isContactPerson)
          this.updateContactPerson(saved.id)
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while updating user: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  async changePwd(updatePwdDto: UpdatePwdDto, id: number) {
    try {
      const {password} = updatePwdDto;
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        this.loggerService.error(`User not found with id: ${id}`, UsersService.name);
        throw new NotFoundException('Utilisateur non trouvé !');
      }

      const salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, salt);
      return user.save().then((saved) => {
        this.loggerService.log('User password updated successfully', UsersService.name);
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      this.loggerService.error(`Error occurred while changing user password: ${error.message}`, UsersService.name);
      throw error;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }


  async hasActiveAdmin() {
    try {
      const role = await this.rolesService.adminRole();
      const defaultStatus = await this.userStatusService.defaultStatus();
      const adminCount = await this.userRepository.count({
              where: {
                role: { id: role.id },
                status: { id: defaultStatus.id },
              }
          });

    return adminCount > 0;
    } catch (error) {
      return false;
    }
  }

async createDefaultAdmin() {
  try {
    const role = await this.rolesService.adminRole();
    if (!role) {
      this.loggerService.error('Role ADMIN not found. Make sure createDefaultRoles() runs first.', UsersService.name);
      return false;
    }

    const hasAnyAdmin = await this.hasActiveAdmin();
    if (!hasAnyAdmin) {
      const defaultStatus = await this.userStatusService.defaultStatus();
      let user = new User();
      user.fullname ="Admin"
      user.phone = process.env.ADMIN_PHONE;
      user.status = defaultStatus;
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      user.role = role;
      user.isContactPerson = true;

      if (!user.phone ) throw new Error("ADMIN_PHONE is not defined in .env");
      if (!user.password) throw new Error("ADMIN_PASSWORD is not defined in .env");

      await this.userRepository.upsert(user, ['phone']);
      this.loggerService.log(`Default admin created.`, UsersService.name);
    }

    return true;
  } catch (error) {
    this.loggerService.error(`Error occurred while creating default admin: ${error.message}`, UsersService.name);
    return false;
  }
}

}
