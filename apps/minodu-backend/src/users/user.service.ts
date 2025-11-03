import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly productsService: ProductsService
  ) { }

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
      console.log('Admin.dashboard.error', error);
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
      console.log('User.all.error', error);
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
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return one;
    } catch (error) {
      console.log('User.one.error', error);
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
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return { ...DataFormater.getUser(one)};
    } catch (error) {
      console.log('User_.one.error', error);
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
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      return user;
      // return { ...DataFormater.getUser(user)};
    } catch (error) {
      console.log('User.one.error', error);
      throw error;
    }
  }


  async updateUserRole(id: number, idRole: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      const role = await this.roleRepository.findOne({
        where: { id: idRole },
      });
      if (!role) {
        throw new NotFoundException('Role utilisateur non trouvé !');
      }
      user.role = role;
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('UserRole.update.error', error);
      throw error;
    }
  }

  async updateUserStatus(id: number, idStuatus: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      const userState = await this.userStatusRepository.findOne({
        where: { id: idStuatus},
      });
      if (!userState) {
        throw new NotFoundException('Etat d\'utilisateur non trouvé !');
      }
      user.status = userState;
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('User.update.error', error);
      throw error;
    }
  }


  async deleteUser(id) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé !');
      }

      return user.softRemove().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('User.delete.error', error);
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
        throw new NotFoundException('Utilisateur non trouvé !');
      }
      if (fullName) user.fullname = fullName;
      if (phone) user.phone = phone;
      if (gender) user.gender = gender;
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('User.update.error', error);
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const { fullName, gender, phone } = updateUserDto;
      const user = await this.userRepository.findOne({
        where: { 
          id: parseInt(userId),
          role:{name:userRole.USER}
         },
      });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé ou impossible de le modifier !');
      }
      if (fullName) user.fullname = fullName;
      if (phone) user.phone = phone;
      if (gender) user.gender = gender;
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('User.update.error', error);
      throw error;
    }
  }

  async changePwd(updatePwdDto: UpdatePwdDto, currentUser) {
    try {
      const {password } = updatePwdDto;
      const user = await this.userRepository.findOne({
        where: { id: currentUser.id },
      });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé !');
      }

      const salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, salt);
      return user.save().then((saved) => {
        return DataFormater.getUser(saved);
      });
    } catch (error) {
      console.log('User.changePwd.error', error);
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
      const hasAnyAdmin = await this.hasActiveAdmin();
      if (!hasAnyAdmin) {
        const defaultStatus = await this.userStatusService.defaultStatus();
        const role = await this.rolesService.adminRole();

        let user = new User();
        user.phone = "90000000";
        user.status = defaultStatus;
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash('Admin@123', salt);
        user.role = role;
        await user.save();
      }
      return true;
    } catch (error) {
      console.log('defaultAdmin.create.default.error', error);
      throw error;
    }
  }
}
