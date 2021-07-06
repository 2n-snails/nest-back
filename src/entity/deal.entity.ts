import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

}
