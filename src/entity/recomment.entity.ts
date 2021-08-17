import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity()
export class ReComment {
  @PrimaryGeneratedColumn()
  recomment_no: number;

  @Column({ type: 'varchar', length: 200 })
  recomment_content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => Comment, (comment) => comment.recomments)
  @JoinColumn({ name: 'recomment_comment_no' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.recomments)
  @JoinColumn({ name: 'recomment_user_no' })
  user: User;
}
