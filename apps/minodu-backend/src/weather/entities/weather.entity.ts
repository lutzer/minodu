import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'weather', schema: 'public' })
export class Weather extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  temperature1: number;

  @Column({ nullable: true })
  humidity: number;

  @Column({ type: 'float', nullable: true })
  humidity1: number;

  @Column({ type: 'float', nullable: true })
  pressure: number;

  @Column({ type: 'float', nullable: true })
  luminosity: number;

  @Column({ nullable: true })
  co: number;

  @Column({ nullable: true })
  no2: number;

  @Column({ type: 'float', nullable: true })
  ambient: number;

  @Column({ type: 'varchar', length:1000, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}
