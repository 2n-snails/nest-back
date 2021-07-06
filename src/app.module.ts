import { ProductCategory } from './entity/product_category.entity';
import { AddressCity } from 'src/entity/address_city.entity';
import { AddressArea } from './entity/address_area.entity';
import { User } from './entity/user.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { MypageModule } from './mypage/mypage.module';
import { AuthModule } from './auth/auth.module';
import config from 'typeorm.config';
import { Category } from './entity/category.entity';
import { Comment } from './entity/comment.entity';
import { Deal } from './entity/deal.entity';
import { Image } from './entity/image.entity';
import { Notice } from './entity/notice.entity';
import { Product } from './entity/product.entity';
import { ReComment } from './entity/recomment.entity';
import { Review } from './entity/review.entity';
import { Wish } from './entity/wish.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([
      AddressArea,
      AddressCity,
      User,
      Deal,
      Notice,
      Category,
      Product,
      Image,
      ProductCategory,
      Wish,
      // Review,
      // Comment,
      // ReComment,
    ]),
    ProductModule,
    UsersModule,
    MypageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // 미들웨어들은 consumer에 연결
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
