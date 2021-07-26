import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Image } from 'src/entity/image.entity';
import { Category } from 'src/entity/category.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Comment } from 'src/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Comment,
      Image,
      Category,
      ProductCategory,
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
