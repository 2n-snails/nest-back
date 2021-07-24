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
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace('Bearer ', '');
    request.user = await this.validate(token);
    response.setHeader('a', 'a');
    return true;
  }

  async validate(token: string) {
    try {
      // 토큰 검증
      const token_verify = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // 토큰의 남은 시간 체크
      const tokenExp = new Date(token_verify['exp'] * 1000);
      const current_time = new Date();

      const time_remaining = Math.floor(
        (tokenExp.getTime() - current_time.getTime()) / 1000 / 60,
      );

      if (time_remaining < 5) {
        console.log('남은 시간 5분 미만');
        const user = await this.userService.findUserById(token_verify.user_no);
        const new_token = this.authService.createLoginToken(user);
      } else {
        console.log('남은 시간 5분이상');
        if (token_verify.user_token === 'loginToken') {
          return await this.userService.findUserById(token_verify.user_no);
        } else {
          return token_verify;
        }
      }
    } catch (error) {
      throw new UnauthorizedException(
        '유효하지 않은 토큰입니다.',
        'UnauthorizedException',
      );
    }
  }
}
