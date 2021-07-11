import { Product } from './product.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  image_no: number;

  @Column({ type: 'varchar', length: 250 })
  image_src: string;

  @Column({ type: 'integer' })
  image_order: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'image_product_no' })
  product: Product;
}
