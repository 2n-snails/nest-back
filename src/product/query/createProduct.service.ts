import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { User } from 'src/entity/user.entity';
import { Connection, getRepository, Like, Repository } from 'typeorm';
import { CreatedCommentDTO } from '../dto/createComment.dto';
import { CreatedProductDTO } from '../dto/createProduct.dto';
import { CreateReCommentDTO } from '../dto/createReComment.dto';

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
    private readonly connection: Connection,
  ) {}

  async createProduct(
    createdProductDTO: CreatedProductDTO,
    user: User,
  ): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result: { success: boolean; message: string; statusCode?: number };
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
      result = { success: true, message: 'Product Upload Successful' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      result = {
        success: false,
        message: 'Create Product Fail',
      };
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async createComment(
    createdCommentDTO: CreatedCommentDTO,
    user: User,
    product: Product,
  ) {
    try {
      const { comment_content } = createdCommentDTO;
      await getRepository(Comment)
        .createQueryBuilder()
        .insert()
        .values({
          comment_content,
          user,
          product,
        })
        .execute();
      return { success: true, message: 'Success Create Comment' };
    } catch (error) {
      return {
        success: false,
        message: 'Create Comment Fali',
        statusCode: 500,
      };
    }
  }

  async createRecomment(
    user: User,
    comment: Comment,
    createReCommentDto: CreateReCommentDTO,
  ) {
    try {
      // 대댓글 작성
      const { recomment_content } = createReCommentDto;
      await getRepository(ReComment)
        .createQueryBuilder()
        .insert()
        .values({
          recomment_content,
          comment,
          user,
        })
        .execute();
      return { success: true, message: 'Success Create Recomment' };
    } catch (error) {
      return {
        success: false,
        message: 'Create Recomment fail',
        statusCode: 500,
      };
    }
  }
}
