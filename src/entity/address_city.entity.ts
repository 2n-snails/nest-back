import { AddressArea } from './address_area.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressCity {
  @PrimaryGeneratedColumn()
  city_no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  city_name: string;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @OneToMany(() => AddressArea, (addressArea) => addressArea.area_city_no)
  AddressAreas: AddressArea[];
}
