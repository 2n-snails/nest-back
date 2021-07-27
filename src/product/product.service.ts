import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Image } from 'src/entity/image.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Connection, Like, Repository } from 'typeorm';
import { CreatedProductDTO } from './dto/createProduct.dto';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { User } from 'src/entity/user.entity';
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
}
