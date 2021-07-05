import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReComments {
  @PrimaryGeneratedColumn()
  recomment_no: number;

  @Column('varchar', { name: 'recomment_content', length: 200 })
  recomment_content: string;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  @CreateDateColumn()
  created_at: Date;

  // 관계 설정
}
