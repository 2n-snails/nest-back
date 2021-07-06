import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';

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
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
}
