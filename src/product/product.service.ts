import { UpdateProdcutDTO } from './dto/updateProduct.dto';
import { CreatedCommentDTO } from './dto/createComment.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatedProductDTO } from './dto/createProduct.dto';
import { getConnection, getRepository, Like, Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { Wish } from 'src/entity/wish.entity';
import { CreateReCommentDTO } from './dto/createReComment.dto';
import { CreateProductService } from './query/createProduct.service';
import { User } from 'src/entity/user.entity';
import { ReadProductService } from './query/readProduct.service';
import { UpdateProductService } from './query/updateProduct.service';
@Injectable()
export class ProductService {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly readProductService: ReadProductService,
    private readonly updateProductService: UpdateProductService,
  ) {}

  async findProductById(product_no: number): Promise<any> {
    return await this.readProductService.findProductById(product_no);
  }

  async createProduct(
    createdProductDTO: CreatedProductDTO,
    user: User,
  ): Promise<any> {
    return await this.createProductService.createProduct(
      createdProductDTO,
      user,
    );
  }

  async findOne(product_no: number) {
    const product = await getRepository(Product)
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
      .loadRelationCountAndMap('p.wishCount', 'p.wishes', 'wishCount', (qb) =>
        qb.where('wishCount.deleted = :value', { value: 'N' }),
      )
      .where('p.product_no = :product_no', { product_no })
      .getMany();
    return product;
  }

  async findCommentById(comment_no: number) {
    return await this.readProductService.findCommentOne(comment_no);
  }

  async createComment(
    createdCommentDTO: CreatedCommentDTO,
    user: User,
    product: Product,
  ) {
    return await this.createProductService.createComment(
      createdCommentDTO,
      user,
      product,
    );
  }

  async createReComment(
    user: User,
    comment: Comment,
    createReCommentDto: CreateReCommentDTO,
  ) {
    return await this.createProductService.createRecomment(
      user,
      comment,
      createReCommentDto,
    );
  }

  // 판매자 전화번호 보내주기
  async findSellerPhoneNum(product_no: number) {
    return await this.readProductService.findPhoneNumber(product_no);
  }
  async findWishById(user_no, product_id) {
    return this.readProductService.findWishById(user_no, product_id);
  }

  async createWish(user: User, product: Product) {
    return this.createProductService.createWish(user, product);
  }

  async deleteWish(user_no, product_id) {
    await getConnection()
      .createQueryBuilder()
      .update(Wish)
      .set({ deleted: 'Y' })
      .where(`wish_user_no= ${user_no}`)
      .andWhere(`wish_product_no= ${product_id}`)
      .execute();
  }

  async deleteProduct(user_no, product_id) {
    const deleteProduct = await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ deleted: 'Y' })
      .where(`product_user_no= ${user_no}`)
      .andWhere(`product_no= ${product_id}`)
      .execute();

    return deleteProduct;
  }

  // 상품의 판매자 정보 찾기
  async findUserByProduct(product_no: number) {
    return await this.readProductService.findUserbyProduct(product_no);
  }

  async updateProduct(updateProdcutDTO: UpdateProdcutDTO, product_no: number) {
    const product = await this.readProductService.findProductById(product_no);
    if (!product.success) {
      throw new HttpException(
        {
          success: false,
          message: product.message,
        },
        product.statusCode,
      );
    }
    return await this.updateProductService.updateProduct(
      updateProdcutDTO,
      product.data,
    );
  }

  async getAllAddress(): Promise<any> {
    return await this.readProductService.findAddress();
  }

  async getAllCategory(): Promise<any> {
    return await this.readProductService.findCategory();
  }
}
