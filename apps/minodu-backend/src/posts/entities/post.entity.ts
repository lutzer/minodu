import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { PostCategory } from "src/post_categories/entities/post_categories.entity";
import { PostResource } from "src/post_resources/entities/post_resources.entity";
import { PostTag } from "src/post_tags/entities/post_tag.entity";


@Entity({ name: 'backend_post', schema: 'public' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ nullable: true })
  attachmentKb: string;

  @Column({ nullable: true })
  attachmentPdf: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts)
  postCategory: PostCategory;

  @ManyToMany(() => PostResource, (resource) => resource.posts, {
    cascade: true
  })
  @JoinTable({
    name: 'backend_posts_resources',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'resourceId',
      referencedColumnName: 'id',
    },
  })
  resources: PostResource[];

  @ManyToMany(() => PostTag, (tag) => tag.posts, {
    cascade: true
  })
  @JoinTable({
    name: 'backend_posts_tags',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: PostTag[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}