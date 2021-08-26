import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { Wish } from 'src/entity/wish.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class DeleteProductService {
  async deleteProduct(user_no: number, product_no: number) {
    return await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ deleted: 'Y' })
      .where(`product_user_no= ${user_no}`)
      .andWhere(`product_no= ${product_no}`)
      .execute();
  }

  async deleteWish(user_no: number, product_no: number) {
    return await getConnection()
      .createQueryBuilder()
      .update(Wish)
      .set({ deleted: 'Y' })
      .where(`wish_user_no= ${user_no}`)
      .andWhere(`wish_product_no= ${product_no}`)
      .execute();
  }
}
