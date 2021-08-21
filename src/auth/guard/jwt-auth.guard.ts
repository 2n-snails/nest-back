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
      response.setHeader('tokenReissue', true);
    } else {
      response.setHeader('tokenReissue', false);
    }
    request.user = tokenValidate.user ? tokenValidate.user : tokenValidate;
    return true;
  }

  async validate(token: string) {
    try {
      // 토큰 검증
      const token_verify = await this.authService.tokenValidate(token);

      // 토큰의 남은 시간 체크
      const tokenExp = new Date(token_verify['exp'] * 1000);
      const current_time = new Date();

      const time_remaining = Math.floor(
        (tokenExp.getTime() - current_time.getTime()) / 1000 / 60,
      );

      if (token_verify.user_token === 'loginToken') {
        if (time_remaining < 5) {
          // 로그인 토큰의남은 시간이 5분 미만일때
          // 엑세스 토큰 정보로 유저를 찾는다.
          const access_token_user = await this.userService.findUserById(
            token_verify.user_no,
          );
          const refresh_token = await this.authService.tokenValidate(
            access_token_user.user_refresh_token,
          );
          const refresh_token_user = await this.userService.findUserById(
            refresh_token.user_no,
          );
          const new_token = await this.authService.createLoginToken(
            refresh_token_user,
          );
          return {
            user: refresh_token_user,
            new_token,
            tokenReissue: true,
          };
        } else {
          // 로그인 토큰의남은 시간이 5분 이상일때
          const user = await this.userService.findUserById(
            token_verify.user_no,
          );
          return {
            user,
            tokenReissue: false,
          };
        }
      } else {
        return token_verify;
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
