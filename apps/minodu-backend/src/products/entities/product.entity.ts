import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ProductCategory } from "src/product_categories/entities/product_category.entity";
import { ProductDemand } from "src/product_demands/entities/demand.entity";
import { ProductOffer } from "src/product_offers/entities/product_offer.entity";

@Entity({ name: 'product', schema: 'public' })
@Unique('uniq_product', ['name'])
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  sales_unit: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  audio_url: string;

  @ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
  productCategory: ProductCategory;

  @OneToMany(() => ProductOffer, (productOffer) => productOffer.product)
  productOffers: ProductOffer[];

  @OneToMany(() => ProductDemand, (productDemand) => productDemand.product)
  productDemands: ProductDemand[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

}
