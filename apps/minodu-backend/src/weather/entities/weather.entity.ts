import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'backend_weather', schema: 'public' })
export class Weather extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  temperature1: number;

  @Column({ type: 'float', nullable: true })
  humidity: number;

  @Column({ type: 'float', nullable: true })
  humidity1: number;

  @Column({ type: 'float', nullable: true })
  pressure: number;

  @Column({ type: 'float', nullable: true })
  luminosity: number;

  @Column({ type: 'float', nullable: true })
  co: number;

  @Column({ type: 'float', nullable: true })
  no2: number;

  @Column({ type: 'float', nullable: true })
  ambient: number;

  @Column({ nullable: true })
  wind_direction: number;

  @Column({ type: 'float', nullable: true })
  wind_speed: number;

  @Column({ type: 'float', nullable: true })
  indice_uv: number;

  @Column({ type: 'float', nullable: true })
  battery: number;

  @Column({ nullable: true })
  time: string;

  @Column({ type: 'varchar', length:1000, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}
