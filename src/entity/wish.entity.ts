import { Product } from './product.entity';
import { User } from './user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  wish_no: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'wish_user_no' })
  user: User;

  @ManyToOne(() => Product, (product) => product.wishes)
  @JoinColumn({ name: 'wish_product_no' })
  product: Product;
}
