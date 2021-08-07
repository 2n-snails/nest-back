import { Injectable } from '@nestjs/common';
import { getConnection, getManager, getRepository } from 'typeorm';
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

  async getMainPageData(query: any) {
    /* 
    상품 테이블
      - 상품 이름
      - 상품 설명
      - 상품 가격
      - 상품 올린 시간
    이미지 테이블 
      - 이미지 주소
      - 이미지 순서?
    유저 테이블
      - 판매자 이름
      - 판매자 프로필 이미지주소
    댓글 테이블
      - 댓글 갯수
    찜 테이블
      - 찜 갯수
    유저의 거래희망지역 테이블
      - 거래희망 지역 번호
    거래희망 지역테이블 
      - 지역 이름
    거래희망 지역 도시 테이블
      - 도시 이름
    */
    const { sort, limit, page } = query;
    const count = await getRepository(Product).count();
    const totalPage = Math.ceil(count / limit);
    if (page <= totalPage && page > 0) {
      if (page > 1 && !query.firstProductNo && !query.lastProductNo) {
        return { success: false, message: 'not a valid request' };
      }
      const sortData = await getRepository(Product)
        .createQueryBuilder('p')
        .select([
          'p.product_no',
          'COUNT(pc.comment_product_no) as commentCount',
        ])
        .leftJoin('p.comments', 'pc')
        .groupBy('p.product_no')
        .addGroupBy('pc.comment_product_no')
        .orderBy('commentCount', 'DESC')
        .limit(5)
        .offset(5)
        .execute();
      console.log(sortData);

      const qb = getRepository(Product)
        .createQueryBuilder('p')
        .addSelect([
          'p.product_no',
          'p.product_title',
          'i.image_src',
          'i.image_order',
          'i.image_no',
        ])
        .where(`p.product_no IN (:...no)`, { no: [1, 2, 3] })
        .leftJoin('p.user', 'u')
        .leftJoin('p.images', 'i')
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
      if (page <= totalPage && query.lastProductNo) {
        qb.where(`p.product_no < ${query.lastProductNo}`);
      }
      if (page <= totalPage && query.firstProductNo) {
        qb.where(`p.product_no > ${query.firstProductNo}`);
      }
      const data = await qb.getMany();
      const firstProductNo = data[0].product_no;
      const lastProductNo = data[data.length - 1].product_no;

      const next =
        page < totalPage
          ? `${
              process.env.SERVER_URL
            }/api/v1/main?sort=${sort}&limit=${limit}&page=${
              Number(page) + 1
            }&lastProductNo=${lastProductNo}`
          : null;
      const prev =
        page <= totalPage && page > 1
          ? `${
              process.env.SERVER_URL
            }/api/v1/main?sort=${sort}&limit=${limit}&page=${
              Number(page) - 1
            }&firstProductNo=${firstProductNo}`
          : null;
      return {
        success: true,
        data,
        totalCount: count,
        firstProductNo,
        lastProductNo,
        next,
        prev,
      };
    }
    return { success: false, message: 'There is no data on that page' };
  }
}
