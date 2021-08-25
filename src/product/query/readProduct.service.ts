import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ReadProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findProductById(product_no: number): Promise<any> {
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
        return {
          success: false,
          message: `No Product Number ${product_no}`,
          statusCode: 404,
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Server error', statusCode: 500 };
    }
  }

  async findCategory(): Promise<any> {
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

  async findAddress(): Promise<any> {
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

  async findUserbyProduct(product_no: number): Promise<any> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('p')
        .select('u.user_no as user_no')
        .leftJoin('p.user', 'u')
        .where(`product_no = ${product_no}`)
        .getRawOne();
      if (!product) {
        return {
          success: false,
          message: `No Product Number ${product_no}`,
          statusCode: 404,
        };
      }
      return { success: true, data: product };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Server error', statusCode: 500 };
    }
  }

  async findCommentOne(comment_no: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: {
          comment_no: comment_no,
          deleted: 'N',
        },
      });
      if (comment) {
        return { success: true, data: comment };
      } else {
        return { success: false, message: 'No comments', statusCode: 404 };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message, statusCode: 500 };
    }
  }

  async findWishById(user_no: number, product_no: number) {
    try {
      const wish = await getRepository(Wish)
        .createQueryBuilder('wish')
        .select()
        .where(`wish.user = ${user_no}`)
        .andWhere(`wish.product = ${product_no}`)
        .getOne();
      if (!wish) {
        return { success: true };
      } else {
        return { success: false, message: 'already exist' };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Server Error', statusCode: 500 };
    }
  }

  async findPhoneNumber(product_no: number) {
    try {
      const phone_number = await this.productRepository
        .createQueryBuilder('p')
        .select('u.user_tel as user_tel')
        .leftJoin('p.user', 'u')
        .where(`p.product_no = ${product_no}`)
        .getRawOne();
      if (phone_number) {
        return { success: true, data: phone_number };
      } else {
        return {
          success: true,
          data: phone_number,
          message: 'no phone number',
        };
      }
    } catch (error) {
      return { success: false, message: 'Server Error', statusCode: 500 };
    }
  }
}
