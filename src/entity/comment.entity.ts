import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { ReComment } from './recomment.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_no: number;

  @Column({ type: 'varchar', length: 200 })
  comment_content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'comment_user_no' })
  user: User;

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({ name: 'comment_product_no' })
  product: Product;

  @OneToMany(() => ReComment, (recomment) => recomment.comment)
  recomments: ReComment[];
}
