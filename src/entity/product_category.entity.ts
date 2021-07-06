import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

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
  category: Category;
}
