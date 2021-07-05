import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notices {
  @PrimaryGeneratedColumn()
  notice_no: number;

  @Column('varchar', { name: 'notice_type', length: 30 })
  notice_type: string;

  @Column('number', { name: 'notice_target_no' })
  notice_target_no: number;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  // 관계 설정
}
