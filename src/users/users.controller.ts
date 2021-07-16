import {
  Controller,
  forwardRef,
  Get,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  // 카카오 로그인 실행
  @UseGuards(AuthGuard('kakao'))
  @Get('auth/kakao')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoLogin() {}
  // 카카오 로그인 콜백
  @UseGuards(AuthGuard('kakao'))
  @Get('auth/kakaocallback')
  async kakaocallback(@Req() req) {
    if (req.user.loginsuccess) {
      // 로그인 성공시 토큰 발급
      return this.authService.login(req.user);
    } else {
      // 로그인 실패시 소셜 데이터를 담은 토큰 전달
      const userData = await this.authService.registUserData(req.user);
      return {
        userData,
        loginsuccess: false,
      };
    }
  }
}
