import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';

@Module({
  providers: [MypageService],
  controllers: [MypageController]
})
export class MypageModule {}
