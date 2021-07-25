import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductService {
  async getOne(product_no: number) {
    const product = await getRepository(Product)
      .createQueryBuilder('product')
      .where('product.product_no = :product_no', { product_no })
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.productCategories', 'ProductCategory')
      .getMany();

    return product;
  }
}
