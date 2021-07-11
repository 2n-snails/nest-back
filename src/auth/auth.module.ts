import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao.guard';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { KakaoStrategy } from './strategy/kakao.strategy';

@Module({
  imports: [
    // 패스포트 세션 설정
    PassportModule.register({ session: true }),
  ],
  providers: [AuthService, KakaoStrategy, KakaoAuthGuard, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
