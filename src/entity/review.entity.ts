import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_no: number;

  @Column('varchar', { name: 'review-content', length: 100 })
  review_content: string;

  @Column('varchar', { name: 'review_image', nullable: true, default: 'none' })
  review_image: string;

  @Column('number', { name: 'review_score' })
  review_score: number;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  @CreateDateColumn()
  created_at: Date;

  // 관계 설정
}
