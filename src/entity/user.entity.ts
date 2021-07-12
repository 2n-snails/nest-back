import { Product } from './product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Deal } from './deal.entity';
import { Notice } from './notice.entity';
import { ReComment } from './recomment.entity';
import { Review } from './review.entity';
import { Wish } from './wish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_no: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  user_email: string;

  @Column({ type: 'varchar', length: 20 })
  user_tel: string;

  @Column({ type: 'smallint', default: 10 })
  user_level: number;

  @Column({ type: 'varchar', length: 100, default: 'none' })
  user_profile_image: string;

  @Column({ type: 'varchar', length: 255, default: 'none' })
  user_intro: string;

  @Column({ type: 'varchar', length: 30 })
  user_nick: string;

  @Column({ type: 'varchar', length: 20 })
  user_provider: string;

  @Column({ type: 'boolean', default: false })
  user_privacy: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @OneToMany(() => Deal, (deal) => deal.user)
  deals: Deal[];

  @OneToMany(() => Notice, (notice) => notice.writer)
  notices_writer: Notice[];

  @OneToMany(() => Notice, (notice) => notice.receiver)
  notices_receiver: Notice[];

  @OneToMany(() => Review, (review) => review.writer)
  review_writer: Review[];

  @OneToMany(() => Review, (review) => review.receiver)
  review_receiver: Review[];

  @OneToMany(() => Wish, (wish) => wish.user)
  wishes: Wish[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => ReComment, (recomment) => recomment.user)
  recomments: ReComment[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
