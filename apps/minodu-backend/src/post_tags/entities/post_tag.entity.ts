import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Post } from "src/posts/entities/post.entity";

@Entity({ name: 'backend_post_tag', schema: 'public' })
@Unique('uniq_post_tag', ['name'])
export class PostTag extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255})
  image: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
