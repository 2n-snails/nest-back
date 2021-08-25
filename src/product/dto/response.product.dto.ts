import { Product } from 'src/entity/product.entity';

export class ResProductDTO {
  success: boolean;
  data?: Product;
  message?: string;
}
