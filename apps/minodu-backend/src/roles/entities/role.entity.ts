import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity({ name: 'backend_role', schema: 'public' })
@Unique('uniq_role', ['name'])
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 60 })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

}
