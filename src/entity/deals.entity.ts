import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deals {
  @PrimaryGeneratedColumn()
  deal_no: number;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  //관계 설정
}
