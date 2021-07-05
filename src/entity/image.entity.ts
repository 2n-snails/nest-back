import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  image_no: number;

  @Column('varchar', { name: 'image_src', length: 250 })
  image_src: string;

  @Column('number', { name: 'image_order' })
  image_order: number;

  @Column('varchar', { name: 'deleted', length: 15, default: 'N' })
  deleted: string;
}
