import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ReadProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findProductById(product_no: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: {
        product_no: product_no,
        deleted: 'N',
      },
    });
  }

  async findCategory(): Promise<Category[]> {
    return await getRepository(Category)
      .createQueryBuilder('category')
      .select(['category.category_name'])
      .getMany();
  }

  async findAddress(): Promise<AddressCity[]> {
    return await getRepository(AddressCity)
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.addressAreas', 'area')
      .select(['city.city_name', 'area.area_name'])
      .getMany();
  }

  async findUserbyProduct(product_no: number) {
    return await this.productRepository
      .createQueryBuilder('p')
      .select('u.user_no as user_no')
      .leftJoin('p.user', 'u')
      .where(`product_no = ${product_no}`)
      .getRawOne();
  }

  async findCommentOne(comment_no: number): Promise<any> {
    const comment = await this.commentRepository.findOne({
      where: {
        comment_no: comment_no,
        deleted: 'N',
      },
    });
    if (comment) {
      return { success: true, data: comment };
    } else {
      return { success: false };
    }
  }

  async findWishById(user_no: number, product_no: number): Promise<boolean> {
    const wish = await getRepository(Wish)
      .createQueryBuilder('wish')
      .select()
      .where(`wish.user = ${user_no}`)
      .andWhere(`wish.product = ${product_no}`)
      .getOne();
    if (!wish) {
      return false;
    } else {
      return true;
    }
  }

  async findPhoneNumber(product_no: number): Promise<Product> {
    return await this.productRepository
      .createQueryBuilder('p')
      .select('u.user_tel as user_tel')
      .leftJoin('p.user', 'u')
      .where(`p.product_no = ${product_no}`)
      .getRawOne();
  }

  async findProductImage(product_no: number): Promise<Image[]> {
    return await getRepository(Image)
      .createQueryBuilder()
      .select('image_src')
      .where(`image_product_no = ${product_no}`)
      .getRawMany();
  }

  async findProductCategory(product_no: number): Promise<any> {
    return await getRepository(ProductCategory)
      .createQueryBuilder('pc')
      .select(['c.category_name as category_name', 'pc.*'])
      .leftJoin('pc.category', 'c')
      .where(`pc.product_no = ${product_no}`)
      .andWhere('pc.deleted = :value', { value: 'N' })
      .getRawMany();
  }

  async findproductOne(product_no: number): Promise<Product[]> {
    return await getRepository(Product)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'image')
      .leftJoinAndSelect('p.productCategories', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('p.user', 'seller')
      .leftJoinAndSelect('p.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentWriter')
      .leftJoinAndSelect('comment.recomments', 'recomment')
      .leftJoinAndSelect('recomment.user', 'recommentWriter')
      .leftJoinAndSelect('seller.deals', 'deal')
      .leftJoinAndSelect('deal.addressArea', 'addressArea')
      .leftJoinAndSelect('addressArea.addressCity', 'addressCity')
      .leftJoinAndSelect('p.wishes', 'wish')
      .select([
        // 상품 기본정보
        'p.product_no',
        'p.product_title',
        'p.product_content',
        'p.product_price',
        'p.product_view',
        'p.product_state',
        'p.createdAt',
        'p.deleted',
        // 상품 이미지
        'image.image_order',
        'image.image_src',
        // 카테고리
        'productCategory.product_category_no',
        'category.category_name',
        // 판매자
        'seller.user_no',
        'seller.user_tel',
        'seller.user_profile_image',
        'seller.user_nick',
        // 거래 희망 지역
        'deal.deal_no',
        'addressArea.area_name',
        'addressCity.city_name',
        // 댓글
        'comment.comment_no',
        'comment.comment_content',
        'commentWriter.user_no',
        'commentWriter.user_profile_image',
        'commentWriter.user_nick',
        // 대댓글
        'recomment.recomment_no',
        'recomment.recomment_content',
        'recommentWriter.user_no',
        'recommentWriter.user_profile_image',
        'recommentWriter.user_nick',
      ])
      .where('p.product_no = :product_no', { product_no })
      .andWhere('p.deleted = :value', { value: 'N' })
      .andWhere('productCategory.deleted = :value', { value: 'N' })
      .andWhere('image.deleted = :value', { value: 'N' })
      .andWhere('deal.deleted = :value', { value: 'N' })
      .andWhere('comment.deleted = :value', { value: 'N' })
      .andWhere('recomment.deleted = :value', { value: 'N' })
      .loadRelationCountAndMap('p.wishCount', 'p.wishes', 'wishCount', (qb) =>
        qb.where('wishCount.deleted = :value', { value: 'N' }),
      )
      .getMany();
  }
}
