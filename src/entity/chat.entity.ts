import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chat_no: number;

  @Column({ type: 'json' })
  chat_content: JSON;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.seller)
  @JoinColumn({ name: 'seller' })
  seller: User;

  @ManyToOne(() => User, (user) => user.buyer)
  @JoinColumn({ name: 'buyer' })
  buyer: User;

  @ManyToOne(() => Product, (product) => product.chat)
  @JoinColumn({ name: 'product_no' })
  product: Product;
}
