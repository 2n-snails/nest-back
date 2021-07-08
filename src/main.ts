import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Shoppingmall API')
    .setDescription('Shoppingmall REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 엔티티 데코레이터에 없는 값은 거름
      forbidNonWhitelisted: true, // 엔티티 데코레이터에 없는 값이 들어오면 해당 값에 대한 에러 메시지 리턴
      transform: true, // 컨트롤러가 값을 받을 때 컨트롤러에 정의한 타입으로 형 변환
    }),
  );

  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
