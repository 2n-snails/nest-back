import { Injectable } from '@nestjs/common';
import { Review } from 'src/entity/review.entity';
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

  // 유저의 판매중인 상품
  async findUserProduct(user_id: number) {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.products', 'p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('p.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('u.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        'u.user_no',
        'u.user_nick',
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_view',
        'p.product_state',
        'p.createdAt',
        'image.image_src',
        'image.image_order',
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
        'u.userProductCount',
        'u.products',
        'userProductCount',
        (qb) => qb.where(`userProductCount.deleted = 'N'`),
      )
      .where(`u.user_no = ${user_id}`)
      .andWhere(`p.deleted = 'N'`)
      .getMany();
    return result;
  }

  async findUserReview(user_id: number) {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.review_receiver', 'review')
      .leftJoinAndSelect('review.writer', 'reviewWriter')
      .where(`u.user_no = ${user_id}`)
      .select([
        'u.user_no',
        'review.review_image',
        'review.review_content',
        'review.review_score',
        'review.createdAt',
        'reviewWriter.user_no',
        'reviewWriter.user_profile_image',
        'reviewWriter.user_nick',
      ])
      .getMany();
    return result;
  }

  async findMyInfo(user_id: number) {
    const result = await getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.review_receiver', 'review')
      .select([
        'u.user_email',
        'u.user_tel',
        'u.user_profile_image',
        'u.user_intro',
        'u.user_nick',
        'u.user_provider',
        'u.createdAt',
      ])
      // 소수점 둘째 자리까지
      .addSelect('AVG(review.review_score)::numeric(10,2)', 'reviewAvg')
      .where(`u.user_no = ${user_id}`)
      .groupBy('u.user_no')
      .getRawOne();
    return result;
  }

  async userProfileImageUpdate(user_id: number, image: any) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update({
        user_profile_image: image,
      })
      .where(`user_no = ${user_id}`)
      .execute();
    return result;
  }

  // 리뷰 작성
  async writeReview(writer, user_id, content, imageSrc, reviewScore) {
    const result = await getRepository(Review)
      .createQueryBuilder()
      .insert()
      .values({
        receiver: user_id,
        writer: writer,
        review_content: content,
        review_image: imageSrc,
        review_score: reviewScore,
      })
      .execute();
    return result;
  }

  // 회원 탈퇴
  async userDelete(user_no) {
    const result = await getRepository(User)
      .createQueryBuilder()
      .update()
      .set({
        deleted: 'Y',
      })
      .where(`user_no = ${user_no}`)
      .execute();
    return result;
  }

  // 리뷰 삭제
  async reviewDelete(writer, review_id) {
    const result = await getRepository(Review)
      .createQueryBuilder()
      .update()
      .set({
        deleted: 'Y',
      })
      .where(`writer = ${writer}`)
      .andWhere(`review_no = ${review_id}`)
      .execute();
    return result;
  }
}
