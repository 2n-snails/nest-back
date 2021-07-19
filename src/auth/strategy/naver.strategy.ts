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
    console.log(profile);

    const user = await this.authService.validateUser(user_email);
    if (user === null) {
      // 여기서 토큰 발급
      console.log('유저가 없어요');
      return 'hi';
    }
    // 유저가 있을때
    // 여기서 토큰 발급
    console.log('유저가 있어요');
    done(null, user);
    return;
  }
}
