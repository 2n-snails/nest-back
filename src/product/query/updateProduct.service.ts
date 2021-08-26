import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Image } from 'src/entity/image.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { getConnection, Like, Repository } from 'typeorm';
import { UpdateProdcutDTO } from '../dto/updateProduct.dto';
import { ReadProductService } from './readProduct.service';

@Injectable()
export class UpdateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly readProductservice: ReadProductService,
  ) {}
  async updateProduct(updateProdcutDTO: UpdateProdcutDTO, product: Product) {
    const { product_no } = product;
    const { product_title, product_content, product_price } = updateProdcutDTO;
    const image = updateProdcutDTO.images;
    const productCategories = updateProdcutDTO.productCategories;

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
    const productImage = await this.readProductservice.findProductImage(
      product_no,
    );
    // 기존이 사진 데이터 중 새로들어온 사진과 일치하지 않은 사진은 deleted컬럼 값 업데이트
    const deleteToImage = productImage.filter(
      (value) => !image.includes(value.image_src),
    );
    for (let i = 0; i < deleteToImage.length; i++) {
      await getConnection()
        .createQueryBuilder()
        .update(Image)
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
              product,
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
    const category = await this.readProductservice.findProductCategory(
      product_no,
    );

    const deletedCategory = category.filter(
      (value) => !productCategories.includes(value.category_name),
    );
    for (let i = 0; i < deletedCategory.length; i++) {
      await getConnection()
        .createQueryBuilder()
        .update(ProductCategory)
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
        const category_name = await this.categoryRepository.findOne({
          category_name: Like(`${productCategories[i]}`),
        });
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(ProductCategory)
          .values([
            {
              product,
              category: category_name,
            },
          ])
          .execute();
        categoryUpdateResult =
          result.raw.length !== 0 ? categoryUpdateResult : false;
      }
    }
    return result.affected > 0 && imageUpdateResult && categoryUpdateResult
      ? true
      : false;
  }
}
