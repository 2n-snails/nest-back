import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { getRepository, Repository } from 'typeorm';
import { GetAddressCategoryDTO } from '../dto/address.category.dto';
import { ResProductDTO } from '../dto/response.product.dto';

@Injectable()
export class ReadProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findProductById(product_no: number): Promise<ResProductDTO> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          product_no: product_no,
          deleted: 'N',
        },
      });
      if (product) {
        return { success: true, data: product };
      } else {
        return { success: false, message: `No Product Number ${product_no}` };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Server error' };
    }
  }

  async findCategory(): Promise<GetAddressCategoryDTO> {
    try {
      const category = await getRepository(Category)
        .createQueryBuilder('category')
        .select(['category.category_name'])
        .getMany();
      return { success: true, data: category };
    } catch (error) {
      return { success: false, message: 'Get Category fail' };
    }
  }

  async findAddress(): Promise<GetAddressCategoryDTO> {
    try {
      const address = await getRepository(AddressCity)
        .createQueryBuilder('city')
        .leftJoinAndSelect('city.addressAreas', 'area')
        .select(['city.city_name', 'area.area_name'])
        .getMany();
      return { success: true, data: address };
    } catch (error) {
      return { success: false, message: 'Get Address fail' };
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
