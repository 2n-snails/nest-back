import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        // 카카오 전략 옵션
        clientID: process.env.KAKAO_KEY,
        callbackURL: 'http://localhost:4000/users/auth/kakaocallback', // 콜백 URL은 변수로 뺴야 할듯...
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        // 받아온 정보를 통해 해당 유저가 있는지 체크 후 토큰 발급 및 가입 또는 로그인 처리
        console.log(profile);
        const user = profile;
        done(null, user);
      },
    );
  }
}
