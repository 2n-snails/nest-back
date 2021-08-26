import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductCategory } from './entity/product_category.entity';
import { AddressCity } from 'src/entity/address_city.entity';
import { AddressArea } from './entity/address_area.entity';
import { User } from './entity/user.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { MypageModule } from './mypage/mypage.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './entity/category.entity';
import { Comment } from './entity/comment.entity';
import { Deal } from './entity/deal.entity';
import { Image } from './entity/image.entity';
import { Notice } from './entity/notice.entity';
import { Product } from './entity/product.entity';
import { ReComment } from './entity/recomment.entity';
import { Review } from './entity/review.entity';
import { Wish } from './entity/wish.entity';
import { RavenModule, RavenInterceptor } from 'nest-raven';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.test',
      // production 환경일 때는 configModule이 환경변수 파일을 무시한다.
      // prod할 때는 따로 넣기로 하자.
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/src/migrations/*.ts'],
      cli: { migrationsDir: 'src/migrations' },
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
    }),
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
      Comment,
      ReComment,
      Review,
    ]),
    forwardRef(() => ProductModule),
    UsersModule,
    MypageModule,
    AuthModule,
    RavenModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
    AppService,
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  // 미들웨어들은 consumer에 연결
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
