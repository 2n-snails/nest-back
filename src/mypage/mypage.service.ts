import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class MypageService {
  // 유저 닉네임 수정하기
  async userNickUpdate(data, user_no) {
    const { user_nick } = data;
    try {
      const result = await getRepository(User)
        .createQueryBuilder()
        .update(User, { user_nick: user_nick })
        .returning('*')
        .where(`user_no = ${user_no}`)
        .updateEntity(true)
        .execute();
      if (result.affected > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return e;
    }
  }
  // 유저 찜 목록
  async findUserWish(user_id) {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.wishes', 'wish')
      .leftJoinAndSelect('wish.product', 'p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('p.user', 'seller')
      .leftJoinAndSelect('seller.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        'u.user_no',
        'wish.wish_no',
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
      .loadRelationCountAndMap(
        'u.userWishCount',
        'u.wishes',
        'userWishCount',
        (qb) => qb.where(`userWishCount.deleted = 'N'`),
      )
      .where(`u.user_no = ${user_id}`)
      .andWhere(`wish.deleted = 'N'`)
      .getMany();
    return result;
  }
}
