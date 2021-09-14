import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressArea } from './address_area.entity';
import { Product } from './product.entity';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  deal_no: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'N',
  })
  deleted: string;

  @ManyToOne(() => AddressArea, (addressArea) => addressArea.deals)
  @JoinColumn({ name: 'deal_area_no' })
  addressArea: AddressArea;

  @ManyToOne(() => Product, (product) => product.deals)
  @JoinColumn({ name: 'product_no' })
  product: Product;
}
