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
    const user = await this.usersService.findUserByEmail(user_email);
    if (!user) {
      return null;
    }
    return user;
  }

  async loginToken(user: User) {
    const payload = {
      user_no: user.user_no,
      user_email: user.user_email,
      user_level: user.user_level,
      user_profile_image: user.user_profile_image,
      user_nick: user.user_nick,
      user_token: 'loginToken',
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '50m',
      }),
    };
  }

  onceToken(user_profile: any) {
    const payload = {
      user_email: user_profile.user_email,
      user_nick: user_profile.user_nick,
      user_provider: user_profile.user_provider,
      user_token: 'onceToken',
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '10m',
      }),
    };
  }
}
