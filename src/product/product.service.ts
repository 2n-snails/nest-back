import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Connection, Like, Repository } from 'typeorm';
import { CreatedProductDTO } from './dto/createProduct.dto';

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
    private readonly connection: Connection,
  ) {}

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
}
