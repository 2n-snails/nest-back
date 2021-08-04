import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatedProductDTO } from './dto/createProduct.dto';
import {
  Connection,
  getConnection,
  getRepository,
  Like,
  Repository,
} from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { Wish } from 'src/entity/wish.entity';
import { Category } from 'src/entity/category.entity';
import { Image } from 'src/entity/image.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(ReComment)
    private readonly reCommentRepository: Repository<ReComment>,
    private readonly connection: Connection,
  ) {}

  async findProductById(product_no: number) {
    return await this.productRepository.findOne({
      where: {
        product_no: product_no,
        deleted: 'N',
      },
    });
  }

  async createProduct(data: CreatedProductDTO, user): Promise<boolean> {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 상품 업로드
      const { product_title, product_content, product_price } = data;
      const product = await this.productRepository.create({
        product_title,
        product_content,
        product_price,
      });
      product.user = user;
      await queryRunner.manager.save(product);

      // 상품 이미지 업로드
      for (let i = 0; i < data.images.length; i++) {
        const image = await this.imageRepository.create({
          image_src: data.images[i],
          image_order: i + 1,
        });
        image.product = product;
        await queryRunner.manager.save(image);
      }

      // 상품 카테고리 업로드
      for (let i = 0; i < data.productCategories.length; i++) {
        const category = await this.categoryRepository.findOne({
          category_name: Like(`${data.productCategories[i]}`),
        });
        const newProductCategory = await this.productCategoryRepository.create({
          product,
          category,
        });
        await queryRunner.manager.save(newProductCategory);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('트랜잭션 실행중 실패로 롤백 진행');
      await queryRunner.rollbackTransaction();
      result = false;
    } finally {
      await queryRunner.release();
      return result;
    }
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
    return await this.commentRepository.findOne({
      where: {
        comment_no: comment_no,
        deleted: 'N',
      },
    });
  }

  async createComment(user, data, product) {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 댓글 작성
      const { comment_content } = data;
      const comment = await this.commentRepository.create({ comment_content });
      comment.product = product;
      comment.user = user;
      await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();
      // 댓글 작성 후 상품의 판매자에게 알림을 생성해줘야함.
    } catch (error) {
      console.log('트랜잭션 실행중 실패로 롤백 진행');
      await queryRunner.rollbackTransaction();
      result = false;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async createReComment(user, comment, data, id) {
    // id 는 알림생성에 사용할 예정이라 아직은 사용하지 않습니다.
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 대댓글 작성
      const { recomment_content } = data;
      const reComment = this.reCommentRepository.create({ recomment_content });
      reComment.comment = comment;
      reComment.user = user;
      await queryRunner.manager.save(reComment);

      await queryRunner.commitTransaction();
      // 대댓글 작성 후 상품의 판매자에게 알림을 생성해줘야합니다.
    } catch (error) {
      await queryRunner.rollbackTransaction();
      result = false;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  // 판매자 전화번호 보내주기
  async findSellerPhoneNum(product_no: number) {
    try {
      return await this.productRepository
        .createQueryBuilder('p')
        .select('u.user_tel as user_tel')
        .leftJoin('p.user', 'u')
        .where(`p.product_no = ${product_no}`)
        .getRawOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async findWishById(user_no, product_id) {
    const wish = await getRepository(Wish)
      .createQueryBuilder('wish')
      .select()
      .where(`wish.user = ${user_no}`)
      .andWhere(`wish.product = ${product_id}`)
      .getOne();
    return wish;
  }

  async createWish(user_no, product_id) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Wish)
      .values([{ user: user_no, product: product_id }])
      .execute();
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
  async findUserByProduct(product_no) {
    return this.productRepository
      .createQueryBuilder('p')
      .select('u.user_no as user_no')
      .leftJoin('p.user', 'u')
      .where(`product_no = ${product_no}`)
      .getRawOne();
  }

  async updateProduct(data: any, product_no: number) {
    //console.log(data);
    const { product_title, product_content, product_price } = data;
    const image = data.images;
    const result = await this.productRepository
      .createQueryBuilder()
      .update()
      .set({
        product_title,
        product_content,
        product_price,
      })
      .where(`product_no = ${product_no}`)
      .execute();

    const productImage = await this.findProductImage(product_no);
    const imagesrc = productImage.map((image) => {
      return image.image_src;
    });
    console.log(imagesrc);
    // 기존의 디비의 이미지와 새로 들어온 이미지의 정보를 비교 후 없는 값만 새로 추가하기
    // 들어온 데이터와 일치한 데이터가 없다면 모두 추가
    // 일치하지 않는 기존 데이터는 모두 deleted 값 변경 ????!!!!!!
    image.map(async (imageArray, index) => {
      const imageInDatabase = imagesrc.includes(imageArray);
      console.log(imageInDatabase);
      // if (imageInDatabase) {
      //   // 새로 들어온 이미지가 데이터베이스에 이미 있을때
      //   const order = image.indexOf(imageArray.image_src);
      //   if (order !== imageArray.image_order) {
      //     // 새로 들어온 이미지의 순서가 기존의 순서와 다를때
      //     await this.imageRepository
      //       .createQueryBuilder()
      //       .update()
      //       .set({ image_order: order })
      //       .where(`image_no = ${imageArray.image_no}`)
      //       .execute();
      //   }
      // } else {
      //   // 기존의 디비에 있는 정보 중 새로들어온 정보와 일치하지 않다면 deleted컬럼 업데이트
      //   await this.imageRepository
      //     .createQueryBuilder()
      //     .update()
      //     .set({ deleted: 'Y' })
      //     .where(`image_no = ${imageArray.image_no}`)
      //     .execute();
      // }
    });
    return result.affected > 0
      ? { success: true, message: 'product update successful' }
      : { success: false, message: 'product update failure' };
  }

  // 상품의 이미지목록 가져오기
  async findProductImage(product_no) {
    const productImage = await this.imageRepository
      .createQueryBuilder()
      .select('*')
      .where(`image_product_no = ${product_no}`)
      .getRawMany();
    return productImage;
  }
}
