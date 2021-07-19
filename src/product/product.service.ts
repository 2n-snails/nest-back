import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { Connection, Repository } from 'typeorm';
import { CreatedProdutcDTO } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly connection: Connection,
  ) {}

  async createProduct(data: CreatedProdutcDTO): Promise<boolean> {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { product_title, product_content, product_price } = data;
      const product = new Product();
      product.product_title = product_title;
      product.product_price = product_price;
      product.product_content = product_content;
      await queryRunner.manager.save(product);

      for (let i = 0; i < data.images.length; i++) {
        const image = new Image();
        image.image_src = data.images[i];
        image.image_order = 1 + i;
        image.product = product;
        await queryRunner.manager.save(image);
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
