import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { UserSession } from "../../session/entities/session.entity";
import { UserStatus } from "../../user_status/entities/user_status.entity";
import { Role } from "../../roles/entities/role.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { ProductOffer } from 'src/product_offers/entities/product_offer.entity';

@Entity({ name: 'backend_user', schema: 'public' })
@Unique('uniq_phone', ['phone'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, length: 60 })
  fullname: string;

  @Column({ nullable: true, length: 60 })
  gender: string;

  @Column({ nullable: false, length: 60 })
  phone: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  lastConnexion: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => ProductOffer, (productOffer) => productOffer.user)
  productOffers: ProductOffer[];

  @Column({ type: 'boolean', default: false })
  isContactPerson: boolean;

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  sessions: UserSession[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return this.password ? await bcrypt.compare(password, this.password) : false;
  }
}