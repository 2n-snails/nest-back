import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RavenModule, RavenInterceptor } from 'nest-raven';
import { AddressCity } from './entity/address_city.entity';
import { AddressArea } from './entity/address_area.entity';
import { Category } from './entity/category.entity';
import { Comment } from './entity/comment.entity';
import { Chat } from './entity/chat.entity';
import { Deal } from './entity/deal.entity';
import { Image } from './entity/image.entity';
import { Product } from './entity/product.entity';
import { ProductCategory } from './entity/product_category.entity';
import { ReComment } from './entity/recomment.entity';
import { Review } from './entity/review.entity';
import { State } from './entity/state.entity';
import { User } from './entity/user.entity';
import { Wish } from './entity/wish.entity';

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
      synchronize: true,
      logging: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
      AddressCity,
      AddressArea,
      Category,
      Comment,
      Chat,
      Deal,
      Image,
      Product,
      ProductCategory,
      ReComment,
      Review,
      State,
      User,
      Wish,
    ]),
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
