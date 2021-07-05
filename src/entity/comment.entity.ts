import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  comment_no: number;

  @Column('varchar', { name: 'comment_content', length: 200 })
  comment_content: string;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  // 관계 설정
}
