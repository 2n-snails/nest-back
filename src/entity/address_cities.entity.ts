import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressCities {
  @PrimaryGeneratedColumn()
  city_no: number;

  @Column('varchar', { name: 'city_name', length: 30 })
  city_name: string;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  // 관계 설정
}
