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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => User, (user) => user.review_writer)
  @JoinColumn({ name: 'review_writer_user_no' })
  writer: User;

  @ManyToOne(() => User, (user) => user.review_receiver)
  @JoinColumn({ name: 'review_receiver_user_no' })
  receiver: User;
}
