import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { User } from 'src/entity/user.entity';
import { Connection, Like, Repository } from 'typeorm';
import { CreatedCommentDTO } from '../dto/createComment.dto';
import { CreatedProductDTO } from '../dto/createProduct.dto';

@Injectable()
export class CreateProductService {
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

  async createProduct(
    createdProductDTO: CreatedProductDTO,
    user: User,
  ): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 상품 업로드
      const { product_title, product_content, product_price } =
        createdProductDTO;
      const product = this.productRepository.create({
        product_title,
        product_content,
        product_price,
      });
      product.user = user;
      await queryRunner.manager.save(product);

      // 상품 이미지 업로드
      for (let i = 0; i < createdProductDTO.images.length; i++) {
        const image = this.imageRepository.create({
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
      return { success: true, message: 'Product Upload Successful' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createComment(
    createdCommentDTO: CreatedCommentDTO,
    user: User,
    product: Product,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 댓글 작성
      const { comment_content } = createdCommentDTO;
      const comment = this.commentRepository.create({ comment_content });
      comment.product = product;
      comment.user = user;
      await queryRunner.manager.save(comment);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
