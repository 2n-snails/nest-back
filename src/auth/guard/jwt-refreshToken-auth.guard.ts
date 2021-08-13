import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import CryptoJS from 'crypto-js';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { getRepository } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException(
        'Refresh Token 전송 안됨',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const refreshToken = authorization.replace('Bearer ', '');
    const refreshTokenValidate = await this.validate(refreshToken);

    response.setHeader('access_token', refreshTokenValidate);
    response.setHeader('tokenReissue', true);

    return true;
  }

  async validate(refreshToken: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(refreshToken, process.env.AES_KEY);
      const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const token_verify = await this.authService.tokenValidate(token);

      const user = await this.userService.findUserById(token_verify.user_no);

      if (user.user_refresh_token === token) {
        return await this.authService.createLoginToken(user);
      } else {
        throw new Error('no permission');
      }
    } catch (error) {
      switch (error.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'no permission':
          throw new HttpException('해당 요청의 권한이 없습니다', 403);

        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
