import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';

export class GetAddressCategoryDTO {
  success: boolean;
  data?: AddressCity[] | Category[];
  message?: string;
}
