import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Wish } from 'src/entity/wish.entity';
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
    const result = await getRepository(Wish)
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'u')
      .leftJoinAndSelect('wish.product', 'p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.productCategories', 'category')
      .select([
        'wish.wish_no',
        // 상품 정보
        'p.product_no',
        'p.product_title',
        'p.product_price',
        // 상품 이미지
        'image.image_src',
        'image_order',
      ])
      .loadRelationCountAndMap(
        'p.wishCount',
        'p.wishes',
        'productWishCount',
        (qb) => qb.where(`productWishCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'p.commentCount',
        'p.comments',
        'commentCount',
        (qb) => qb.where(`commentCount.deleted = 'N'`),
      )
      .loadRelationCountAndMap(
        'u.wishCount',
        'u.wishes',
        'userWishCount',
        (qb) => qb.where(`userWishCount.deleted = 'N'`),
      )
      .where(`wish.user = ${user_id}`)
      .getMany();
    return result;
  }
}
