import { AddressCity } from 'src/entity/address_cities.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AddressArea {
  @PrimaryGeneratedColumn()
  area_no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  area_name: string;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  @ManyToOne(() => AddressCity)
  @JoinColumn({ name: 'area_city_no' })
  area_city_no: AddressCity;
}
