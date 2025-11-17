import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ProductDemand } from "src/product_demands/entities/demand.entity";

@Entity({ name: 'backend_partner', schema: 'public' })
@Unique('partner', ['name'])
export class Partner extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  adresse: string;

  @Column({ nullable: false })
  phone: string;

  @OneToMany(() => ProductDemand, (productDemand) => productDemand.partner)
  productDemands: ProductDemand[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}