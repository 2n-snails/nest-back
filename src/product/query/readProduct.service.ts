import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ReadProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findProductById(product_no: number): Promise<Product | undefined> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          product_no: product_no,
          deleted: 'N',
        },
      });
      if (!product) {
        throw new Error('No Content');
      }
      return product;
    } catch (error) {
      switch (error.message) {
        case 'No Content':
          throw new Error(error.message);

        default:
          throw new Error(error.message);
      }
    }
  }

  async findCategory(): Promise<Category[]> {
    try {
      return await getRepository(Category)
        .createQueryBuilder('category')
        .select(['category.category_name'])
        .getMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAddress(): Promise<AddressCity[]> {
    try {
      return await getRepository(AddressCity)
        .createQueryBuilder('city')
        .leftJoinAndSelect('city.addressAreas', 'area')
        .select(['city.city_name', 'area.area_name'])
        .getMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUserbyProduct(product_no: number): Promise<Product> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('p')
        .select('u.user_no as user_no')
        .leftJoin('p.user', 'u')
        .where(`product_no = ${product_no}`)
        .getRawOne();
      if (!product) {
        throw new Error('No Content');
      }
      return product;
    } catch (error) {
      switch (error.message) {
        case 'No Content':
          throw new Error(error.message);

        default:
          throw new Error(error.message);
      }
    }
  }
}
