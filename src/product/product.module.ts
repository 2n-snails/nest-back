import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Image } from 'src/entity/image.entity';
import { Category } from 'src/entity/category.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Comment } from 'src/entity/comment.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CreateProductService } from './query/createProduct.service';
import { ReadProductService } from './query/readProduct.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Comment,
      ReComment,
      Image,
      Category,
      ProductCategory,
    ]),
    forwardRef(() => AppModule),
    AuthModule,
    UsersModule,
  ],
  providers: [ProductService, CreateProductService, ReadProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
