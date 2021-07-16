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
    // userData가 kakao에서 넘어온 데이터 일때
    if (user.userData.type === 'kakao') {
      const { user_email, profile_image, nickname } = user.userData;
      const payload = {
        user_email,
        user_profile_image: profile_image,
        user_nick: nickname,
      };
      return {
        access_token: this.jwtService.sign(payload, {
          subject: 'user-data',
          expiresIn: '10m',
        }),
      };
    } else {
      // 네이버 일때
      return;
    }
    // 두개를 나누는 이유는 카카오는 전화번호 정보를 받지 못하기 때문에 payload가 다르기 때문입니다.
  }
}
