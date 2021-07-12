import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Image } from './image.entity';
import { ProductCategory } from './product_category.entity';
import { User } from './user.entity';
import { Wish } from './wish.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_no: number;

  @Column({ type: 'varchar', length: 50 })
  product_title: string;

  @Column({ type: 'varchar', length: 200 })
  product_content: string;

  @Column({ type: 'varchar', length: 25 })
  product_price: string;

  @Column({ type: 'integer', default: 0 })
  product_view: number;

  @Column({ type: 'boolean', default: false })
  product_state: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  productCategories: ProductCategory[];

  @OneToMany(() => Wish, (wish) => wish.product)
  wishes: Wish[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'product_user_no' })
  user: User;
}
