import { Product } from './entity/product.entity';
import { Injectable } from '@nestjs/common';
import { getConnection, getRepository } from 'typeorm';
import { Notice } from './entity/notice.entity';
import { ProductService } from './product/product.service';

@Injectable()
export class AppService {
  constructor(private readonly productService: ProductService) {}
  async createNotice(writer_no, product_no, notice_type) {
    const reciver = await this.productService.findUserByProduct(product_no);
    console.log(reciver);
    console.log(writer_no);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Notice)
      .values([
        {
          notice_type,
          notice_target_no: product_no,
          writer: writer_no,
          receiver: reciver.user_no,
        },
      ])
      .execute();
  }

  async productSearch(data) {
    const { search } = data;
    const resultByTitle = await getRepository(Product)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('p.user', 'seller')
      .leftJoinAndSelect('seller.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_view',
        'p.product_state',
        'p.createdAt',
        'productCategory.product_category_no',
        'category.category_name',
        'image.image_src',
        'image.image_order',
        'seller.user_no',
        'seller.user_nick',
        'deal.deal_no',
        'addressArea.area_name',
        'addressCity.city_name',
      ])
      .loadRelationCountAndMap(
        'p.commentCount',
        'p.comments',
        'commentCount',
        (qb) => qb.where(`commentCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'p.productWishCount',
        'p.wishes',
        'productWish',
        (qb) => qb.where(`productWish.deleted = 'N'`),
      )
      .where(`p.product_title like '%${search}%'`)
      .andWhere(`p.deleted = 'N'`)
      .orderBy('p.product_no', 'DESC')
      .getMany();

    const resultByAddress = await getRepository(Product)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('p.user', 'seller')
      .leftJoinAndSelect('seller.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_view',
        'p.product_state',
        'p.createdAt',
        'productCategory.product_category_no',
        'category.category_name',
        'image.image_src',
        'image.image_order',
        'seller.user_no',
        'seller.user_nick',
        'deal.deal_no',
        'addressArea.area_name',
        'addressCity.city_name',
      ])
      .loadRelationCountAndMap(
        'p.commentCount',
        'p.comments',
        'commentCount',
        (qb) => qb.where(`commentCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'p.productWishCount',
        'p.wishes',
        'productWish',
        (qb) => qb.where(`productWish.deleted = 'N'`),
      )
      .where(`addressCity.city_name like '%${search}%'`)
      .andWhere(`p.deleted = 'N'`)
      .orderBy('p.product_no', 'DESC')
      .getMany();

    return { resultByTitle, resultByAddress };
  }
}
