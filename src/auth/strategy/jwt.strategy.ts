import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('jwtToken'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return payload;
    if (payload.user_token === 'onceToken') {
      // 1회용 토큰일때
      return {
        user_email: payload.user_email,
        user_nick: payload.user_nick,
        user_provider: payload.user_provider,
      };
    }
    // 로그인 토큰일때
    return {
      user_no: payload.user_no,
      user_email: payload.user_email,
      user_level: payload.user_level,
      user_profile_image: payload.user_profile_image,
      user_nick: payload.user_nick,
    };
  }
}
