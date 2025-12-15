import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Partner } from "src/partners/entities/partner.entity";

@Entity({ name: 'backend_product_demand', schema: 'public' })
export class ProductDemand extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.productDemands, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @ManyToOne(() => Product, (product) => product.productDemands, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  deadline: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}