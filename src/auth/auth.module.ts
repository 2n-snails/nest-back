import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  imports: [
    // 패스포트 세션 설정
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: String(process.env.JWT_SECRET_KEY),
    }),
  ],
  providers: [AuthService, KakaoStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
