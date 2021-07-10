import { AddressCity } from 'src/entity/address_city.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deal } from './deal.entity';

@Entity()
export class AddressArea {
  @PrimaryGeneratedColumn()
  area_no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  area_name: string;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => AddressCity, (addressCity) => addressCity.addressAreas)
  @JoinColumn({ name: 'area_city_no' })
  addressCity: AddressCity;

  @OneToMany(() => Deal, (deal) => deal.addressArea)
  deals: Deal[];
}
