import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressAreas {
  @PrimaryGeneratedColumn()
  area_no: number;

  @Column('varchar', { name: 'area_name', length: 30 })
  area_name: string;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  // 관계 설정
}
