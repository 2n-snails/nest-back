import { ProductCategorys } from './entity/product_category.entity';
import { AddressCities } from 'src/entity/address_cities.entity';
import { AddressAreas } from './entity/address_areas.entity';
import { Users } from './entity/user.entity';
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
import { Comments } from './entity/comment.entity';
import { Deals } from './entity/deals.entity';
import { Images } from './entity/image.entity';
import { Notices } from './entity/notice.entity';
import { Products } from './entity/product.entity';
import { ReComments } from './entity/recomment.entity';
import { Reviews } from './entity/review.entity';
import { Wishs } from './entity/wishs.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([
      AddressAreas,
      AddressCities,
      Category,
      Comments,
      Deals,
      Images,
      Notices,
      ProductCategorys,
      Products,
      ReComments,
      Reviews,
      Users,
      Wishs,
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
