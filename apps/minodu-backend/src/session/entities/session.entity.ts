import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'backend_session', schema: 'public' })
export class UserSession extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false, type: 'timestamp' })
  validUntil: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({ type: 'timestamp', nullable: true})
  finishedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}