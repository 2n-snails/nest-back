import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ProductService {
  async findOne(product_no: number) {
    const product = await getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.comments', 'comment')
      .leftJoinAndSelect('comment.recomments', 'recomment')
      .leftJoinAndSelect('product.wishes', 'wish')
      .leftJoinAndSelect('user.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .select([
        // 상품 기본정보
        'product.product_no',
        'product.product_title',
        'product.product_content',
        'product.product_price',
        'product.product_view',
        'product.product_state',
        'product.createdAt',
        'product.deleted',
        // 상품 이미지
        'image.image_order',
        'image.image_src',
        // 카테고리
        'productCategor.product_category_no',
        'category.category_name',
        // 유저
        'users',
        // 'user.user_no',
        // 'user.user_tel',
        // 'user.user_profile_image',
        // 'user.user_nick',
        // // 거래 희망 지역
        // 'addressArea.area_name',
      ])
      // ])
      .where('product.product_no = :product_no', { product_no })
      .getMany();

    return product;
  }
}
