import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user_email: string): Promise<any> {
    const user = this.userService.findOneEmail(user_email);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    return '로그인 후 토큰 발급 해줘야 합니다.';
  }

  async registUserData(user: any) {
    const { user_email, profile_image, nickname } = user.kakaoUserData;
    const payload = {
      user_email,
      user_profile_image: profile_image,
      user_nick: nickname,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        issuer: 'recycling',
        subject: 'user-data',
        expiresIn: '10m',
      }),
      message: 'Membership registration required',
      success: false,
    };
  }
}
