import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn()
  notice_no: number;

  @Column({ type: 'integer' })
  notice_writer_user_no: number;

  @Column({ type: 'varchar', length: 30 })
  notice_type: string;

  @Column({ type: 'integer' })
  notice_target_no: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => User, (user) => user.notices)
  @JoinColumn({ name: 'notice_receiver_user_no' })
  user: User;
}
