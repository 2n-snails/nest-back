import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(user_email: string): Promise<any> {
    const user = await this.usersService.findOne(user_email);
    if (user) {
      // 유저가 있으면 로그인 성공: jwt 토큰 발급
      return user;
    }
    // 유저가 없으면 추가정보 필요: 프론트로 1회용 jwt 토큰 발급
    return null;
  }
}
