import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user_email: string): Promise<any> {
    const user = await this.usersService.findOne(user_email);
    if (!user) {
      return null;
    }
    return user;
  }
  async login(user: User) {
    const payload = {
      user_no: user.user_no,
      user_email: user.user_email,
      user_level: user.user_level,
      user_profile_image: user.user_profile_image,
      user_nick: user.user_nick,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
