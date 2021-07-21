import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user_email = profile._json.kakao_account.email;
    const user_nick = profile._json.properties.nickname;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
    };
    const user = await this.authService.validateUser(user_email);
    if (user === null) {
      // 유저가 없을때
      console.log('일회용 토큰 발급');
      return this.authService.onceToken(user_profile);
    }

    // 유저가 있을때
    console.log('로그인 토큰 발급');
    return this.authService.loginToken(user);
  }
}
