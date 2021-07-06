import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_no: number;

  @Column({ type: 'varchar', length: 100 })
  review_content: string;

  @Column({ type: 'varchar', length: 100, default: 'none' })
  review_image: string;

  @Column({ type: 'integer' })
  review_score: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  // @ManyToOne(() => User, (user) => user.reviews)
  // @JoinColumn({ name: 'review_reciver_user_no' })
  // reciver: User;

  // @ManyToOne(() => User, (user) => user.reviews)
  // @JoinColumn({ name: 'review_user_no' })
  // reviewer: User;
}
