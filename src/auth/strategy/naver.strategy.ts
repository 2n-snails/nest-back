import { Strategy } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user_email = profile._json.email;
    const user_nick = profile._json.nickname;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
    };

    const user = await this.authService.validateUser(user_email);
    if (user === null) {
      // 유저가 없을때
      // 여기서 토큰 발급
      console.log('일회용 토큰 발급');

      return this.authService.onceToken(user_profile);
    }

    // 유저가 있을때
    // 여기서 토큰 발급
    console.log('로그인 토큰 발급');
    return this.authService.loginToken(user);
  }
}
