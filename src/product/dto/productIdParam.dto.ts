import { IsNumberString } from 'class-validator';

export class ProductIdParam {
  @IsNumberString()
  product_id: number;
}
