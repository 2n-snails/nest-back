import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  product_category_no: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => Category, (category) => category.productCategories)
  @JoinColumn({ name: 'category_no' })
  category: Category;

  @ManyToOne(() => Product, (product) => product.productCategories)
  @JoinColumn({ name: 'product_no' })
  product: Product;
}
