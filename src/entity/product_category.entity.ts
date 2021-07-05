import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductCategorys {
  @PrimaryGeneratedColumn()
  product_category_no: number;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;
}
