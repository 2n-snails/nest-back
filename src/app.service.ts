import { Injectable } from '@nestjs/common';
import { getConnection, getRepository } from 'typeorm';
import { Notice } from './entity/notice.entity';
import { Product } from './entity/product.entity';
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

  async getMainPageData(sort, limit, page) {
    const count = await getRepository(Product)
      .createQueryBuilder()
      .where(`deleted = 'N'`)
      .getCount();
    const totalPage = Math.ceil(count / limit);
    if (page <= totalPage && page > 0) {
      const sortQuery = await getRepository(Product)
        .createQueryBuilder('p')
        .select([
          'p.product_no as product_no',
          'COUNT(wish.wish_product_no) as wishCount',
        ])
        .leftJoin('p.wishes', 'wish')
        .where(`p.deleted = 'N'`)
        .groupBy('p.product_no')
        .addGroupBy('wish.wish_product_no');
      if (sort === 'createdAt') {
        sortQuery.orderBy('p.createdAt', 'DESC');
      }
      if (sort === 'wish') {
        sortQuery
          .orderBy('wishCount', 'DESC')
          .addOrderBy('p.createdAt', 'DESC')
          .addOrderBy('p.product_no', 'DESC');
      }

      const sortData = await sortQuery
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany();
      // 정렬 데이터에서 상품 아이디값만 가져오기
      const sortMap = sortData.map((value) => {
        return value.product_no;
      });

      // 정렬된 아이디값을 통해 해당 상품 정보 조회하기
      const qb = getRepository(Product)
        .createQueryBuilder('p')
        // Product Entity
        .select([
          'p.product_no',
          'p.product_title',
          'p.product_content',
          'p.createdAt',
          'p.product_price',
        ])
        // Image Entity
        .addSelect(['i.image_no', 'i.image_order', 'i.image_src'])
        // User Entity
        .addSelect(['u.user_no', 'u.user_nick', 'u.user_profile_image'])
        // Product Category Entity
        .addSelect(['productCategory.product_category_no'])
        // Category Entity
        .addSelect('category.category_name')
        // Deal Entity
        .addSelect('deal.deal_no')
        // AddressArea Entity
        .addSelect('area.area_name')
        // AddressCity Entity
        .addSelect('city.city_name')
        .where(`p.product_no IN (:...no)`, { no: sortMap })
        .leftJoin('p.user', 'u')
        .leftJoin('p.images', 'i', 'i.deleted = :value', { value: 'N' })
        .leftJoin(
          'p.productCategories',
          'productCategory',
          'productCategory.deleted = :value',
          { value: 'N' },
        )
        .leftJoin('productCategory.category', 'category')
        .leftJoin('u.deals', 'deal', 'deal.deleted = :value', { value: 'N' })
        .leftJoin('deal.addressArea', 'area')
        .leftJoin('area.addressCity', 'city')
        .orderBy(`ARRAY_POSITION(ARRAY[${sortMap}], p.product_no)`)
        .loadRelationCountAndMap(
          'p.wishCount',
          'p.wishes',
          'wishCount',
          (qb2) => qb2.where('wishCount.deleted = :value', { value: 'N' }),
        )
        .loadRelationCountAndMap(
          'p.commentCount',
          'p.comments',
          'commentCount',
          (qb2) => qb2.where('commentCount.deleted = :value', { value: 'N' }),
        );
      const data = await qb.getMany();

      const next =
        page < totalPage
          ? `${
              process.env.SERVER_URL
            }/api/v1/main?sort=${sort}&limit=${limit}&page=${Number(page) + 1}`
          : null;
      const prev =
        page <= totalPage && page > 1
          ? `${
              process.env.SERVER_URL
            }/api/v1/main?sort=${sort}&limit=${limit}&page=${Number(page) - 1}`
          : null;
      return {
        success: true,
        data,
        totalCount: count,
        next,
        prev,
      };
    }
    return { success: false, message: 'There is no data on that page' };
  }
}
