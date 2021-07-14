import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      // 카카오 전략 옵션
      clientID: process.env.KAKAO_KEY,
      callbackURL: `${process.env.SERVER_URL}users/auth/kakaocallback`, // 콜백 URL은 변수로 뺴야 할듯...
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const user_email = profile._json.kakao_account.email;
      const { profile_image, nickname } = profile._json.properties;
      const user = await this.authService.validateUser(user_email);
      if (!user) {
        // 데이터베이스에 해당 유저의 정보가 없을 때
        const kakaoUserData = { user_email, profile_image, nickname };
        done(null, { kakaoUserData, loginsuccess: false });
      } else {
        // 해당 유저의 정보가 있을 때
        done(null, { user, loginsuccess: true });
      }
    } catch (error) {
      return error;
    }
  }
}
