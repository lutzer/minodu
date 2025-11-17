import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'backend_configuration', schema: 'public' })
export class Configuration extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  community_name: string;

  @Column({ type:'varchar', length:1000, nullable: false })
  community_introduction: string;

  @Column({ type: 'varchar', length: 255 })
  adresse: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  whatsapp_link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  station_link: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}