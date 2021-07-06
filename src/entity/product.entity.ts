import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_no: number;

  @Column('varchar', { name: 'product_title', length: 50 })
  product_title: string;

  @Column('varchar', { name: 'product_content', length: 200 })
  product_content: string;

  @Column('varchar', { name: 'product_price', length: 25 })
  product_price: string;

  @Column('number', { name: 'product_view', default: 0 })
  product_view: number;

  @Column('boolean', { name: 'product_state', default: false })
  product_state: boolean;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;

  @CreateDateColumn()
  created_at: Date;

  // 관계 설정
}
