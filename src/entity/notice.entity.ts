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
export class Notice {
  @PrimaryGeneratedColumn()
  notice_no: number;

  @Column({ type: 'varchar', length: 30 })
  notice_type: string;

  @Column({ type: 'integer' })
  notice_target_no: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => User, (user) => user.notices_writer)
  @JoinColumn({ name: 'notice_writer_user_no' })
  writer: User;

  @ManyToOne(() => User, (user) => user.notices_receiver)
  @JoinColumn({ name: 'notice_receiver_user_no' })
  receiver: User;
}
