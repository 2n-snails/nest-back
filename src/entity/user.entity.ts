import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { Deal } from './deal.entity';
import { ReComment } from './recomment.entity';
import { Review } from './review.entity';
import { Wish } from './wish.entity';
import { Chat } from './chat.entity';
import { State } from './state.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_no: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  user_provider_id: string;

  @Column({ type: 'smallint', default: 10 })
  user_level: number;

  @Column({ type: 'varchar', length: 100, default: 'none' })
  user_profile_image: string;

  @Column({ type: 'varchar', length: 30 })
  user_nick: string;

  @Column({ type: 'varchar', length: 20 })
  user_provider: string;

  @Column({ type: 'boolean', default: false })
  user_privacy: boolean;

  @Column({ type: 'varchar', nullable: true })
  user_refresh_token: string;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

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

  @OneToMany(() => Chat, (chat) => chat.seller)
  seller: Chat[];

  @OneToMany(() => Chat, (chat) => chat.buyer)
  buyer: Chat[];

  @OneToMany(() => State, (state) => state.user)
  state: State[];
}
