import { CreatedCommentDTO } from './dto/createComment.dto';
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
import { CreateReCommentDto } from './dto/createReComment.dto';
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

  async createProduct(
    createdProductDTO: CreatedProductDTO,
    user,
  ): Promise<boolean> {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 상품 업로드
      const { product_title, product_content, product_price } =
        createdProductDTO;
      const product = await this.productRepository.create({
        product_title,
        product_content,
        product_price,
      });
      product.user = user;
      await queryRunner.manager.save(product);

      // 상품 이미지 업로드
      for (let i = 0; i < createdProductDTO.images.length; i++) {
        const image = await this.imageRepository.create({
          image_src: createdProductDTO.images[i],
          image_order: i + 1,
        });
        image.product = product;
        await queryRunner.manager.save(image);
      }

      // 상품 카테고리 업로드
      for (let i = 0; i < createdProductDTO.productCategories.length; i++) {
        const category = await this.categoryRepository.findOne({
          category_name: Like(`${createdProductDTO.productCategories[i]}`),
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

  async createComment(user, createdCommentDTO: CreatedCommentDTO, product) {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 댓글 작성
      const { comment_content } = createdCommentDTO;
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

  async createReComment(
    user,
    comment,
    createReCommentDto: CreateReCommentDto,
    id,
  ) {
    // id 는 알림생성에 사용할 예정이라 아직은 사용하지 않습니다.
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 대댓글 작성
      const { recomment_content } = createReCommentDto;
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

  async updateProduct(data: any, product_no: any) {
    // 상품 테이블 정보 업데이트
    const { product_title, product_content, product_price } = data;
    const image = data.images;
    const productCategories = data.productCategories;
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

    // 상품이미지 조회
    const productImage = await this.findProductImage(product_no);

    // 기존이 사진 데이터 중 새로들어온 사진과 일치하지 않은 사진은 deleted컬럼 값 업데이트
    const deleteToImage = productImage.filter(
      (value) => !image.includes(value.image_src),
    );
    for (let i = 0; i < deleteToImage.length; i++) {
      await this.imageRepository
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where(`image_src = :src`, { src: deleteToImage[i].image_src })
        .andWhere(`product = ${product_no}`)
        .execute();
    }

    // 이미지 테이블 정보 업데이트
    let imageUpdateResult = true;
    for (let i = 0; i < image.length; i++) {
      let query;
      // 기존의 정보와 새로들어온 정보 중 일치하는 컬럼 값 확인
      const check = productImage.some(
        (images) => images.image_src === image[i],
      );
      // 일치하는 컬럼이 있다면 순서컬럼만 업데이트
      if (check) {
        query = getConnection()
          .createQueryBuilder()
          .update(Image)
          .set({ image_order: i + 1 })
          .where(`image_src = :src`, { src: image[i] })
          .andWhere(`product = ${product_no}`);
      }
      // 일치하는 정보가 없다면 데이터베이스에 추가
      else {
        query = getConnection()
          .createQueryBuilder()
          .insert()
          .into(Image)
          .values([
            {
              image_order: i + 1,
              image_src: image[i],
              product: product_no,
            },
          ]);
      }
      const result = await query.execute();
      imageUpdateResult =
        result.affected > 0 || result.raw.length !== 0
          ? imageUpdateResult
          : false;
    }

    // 카테고리 업데이트
    const category = await this.findProductCategory(product_no);
    const deletedCategory = category.filter(
      (value) => !productCategories.includes(value.category_name),
    );
    for (let i = 0; i < deletedCategory.length; i++) {
      await this.productCategoryRepository
        .createQueryBuilder()
        .update()
        .set({ deleted: 'Y' })
        .where(
          `product_category_no = ${deletedCategory[i].product_category_no}`,
        )
        .execute();
    }
    let categoryUpdateResult = true;
    for (let i = 0; i < productCategories.length; i++) {
      // 기존의 정보와 새로들어온 정보 중 일치하는 컬럼 값 확인
      const check = category.some(
        (categoryes) => categoryes.category_name === productCategories[i],
      );
      if (!check) {
        const categoryName = await this.categoryRepository.findOne({
          category_name: Like(`${productCategories[i]}`),
        });
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ProductCategory)
          .values([
            {
              product: product_no,
              category: categoryName,
            },
          ])
          .execute();
        categoryUpdateResult =
          result.raw.length !== 0 ? categoryUpdateResult : false;
      }
    }
    return result.affected > 0 && imageUpdateResult && categoryUpdateResult
      ? { success: true, message: 'product update successful' }
      : { success: false, message: 'product update failure' };
  }

  async findProductImage(product_no) {
    const productImage = await this.imageRepository
      .createQueryBuilder()
      .select('image_src')
      .where(`image_product_no = ${product_no}`)
      .getRawMany();
    return productImage;
  }

  async findProductCategory(product_no) {
    return await this.productCategoryRepository
      .createQueryBuilder('pc')
      .select(['c.category_name as category_name', 'pc.*'])
      .leftJoin('pc.category', 'c')
      .where(`pc.product_no = ${product_no}`)
      .andWhere('pc.deleted = :value', { value: 'N' })
      .getRawMany();
  }
}
