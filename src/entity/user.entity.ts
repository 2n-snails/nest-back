import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_no: number;

  @Column('varchar', { name: 'user_email', unique: true, length: 100 })
  user_email: string;

  @Column('varchar', { name: 'user_tel', length: 20 })
  user_tel: string;

  @Column('smallint', { name: 'user_level', default: 10 })
  user_level: number;

  @Column('varchar', {
    name: 'user_profile_image',
    length: 100,
    default: 'none',
  })
  user_profile_image: string;

  @Column('varchar', { name: 'user_intro', length: 255, default: 'none' })
  user_intro: string;

  @Column('varchar', { name: 'user_nick', length: 30 })
  user_nick: string;

  @Column('varchar', { name: 'user_provider', length: 20 })
  user_provider: string;

  @Column('boolean', { name: 'user_privacy', default: false })
  user_privacy: boolean;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //관계 설정
}
