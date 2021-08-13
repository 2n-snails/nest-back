import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
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
    const tokenValidate = await this.validate(token);
    if (tokenValidate.tokenReissue) {
      response.setHeader('access_token', tokenValidate.new_token);
      response.setHeader('tokenReissue', tokenValidate.tokenReissue);
    } else {
      response.setHeader('tokenReissue', tokenValidate.tokenReissue);
    }
    request.user = tokenValidate.user;
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
        // 남은 시간이 5분 미만일때
        const user = await this.userService.findUserById(token_verify.user_no);
        const new_token = await this.authService.createLoginToken(user);
        return {
          user,
          new_token,
          tokenReissue: true,
        };
      } else {
        // 남은 시간이 5분 이상일때
        if (token_verify.user_token === 'loginToken') {
          const user = await this.userService.findUserById(
            token_verify.user_no,
          );
          return {
            user,
            tokenReissue: false,
          };
        } else {
          // 헤더의 토큰이 onceToken일때는 그냥 토큰을 그냥 리턴(회원가입을 위한 유저 정보가 담겨있음)
          return token_verify;
        }
      }
    } catch (error) {
      switch (error.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
