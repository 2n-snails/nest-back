import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { Post } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refreshToken-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async naverlogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async callback(@Req() req, @Res() res: Response): Promise<any> {
    res.header('access_token', req.user.access_token);
    res.header('refresh_token', req.user.refresh_token);
    res.send('OK');
    res.end();
    // 리다이렉트 해주는 페이지
    // res.redirect('http://localhost:3000/login');
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaocallback(@Req() req, @Res() res: Response) {
    res.header('access_token', req.user.access_token);
    res.header('refresh_token', req.user.refresh_token);
    res.send('OK');
    res.end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  test(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/login')
  async registUser(@Req() req) {
    const { user_email, user_nick, user_provider, user_token } = req.user;
    const { user_tel, user_privacy } = req.body;
    // 1회용 토큰인경우
    if (user_token === 'onceToken') {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          user_email,
          user_tel,
          user_nick,
          user_provider,
          user_privacy,
        })
        .execute();
      const user = await this.authService.validateUser(user_email);
      await this.authService.createLoginToken(user);
      await this.authService.createRefreshToken(user);
      return { success: true, message: 'user login successful' };
    }
    // 그 외의 경우
    return false;
  }
  // 리프레쉬 토큰을 이용한 엑세스 토큰 재발급하기
  @UseGuards(JwtRefreshGuard)
  @Get('auth/refresh-accesstoken')
  async refreshAccessToken() {
    return { success: true, message: 'new accessToken Issuance success' };
  }
}
