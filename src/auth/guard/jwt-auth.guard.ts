import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import CryptoJS from 'crypto-js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace('Bearer ', '');
    request.user = await this.validate(token);
    return true;
  }

  async validate(token: string) {
    try {
      const token_verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (token_verify.user_token === 'loginToken') {
        return await this.userService.findUserById(token_verify.user_no);
      } else {
        return token_verify;
      }
    } catch (error) {
      throw new UnauthorizedException(
        '유효하지 않은 토큰입니다.',
        'UnauthorizedException',
      );
    }
  }
}
