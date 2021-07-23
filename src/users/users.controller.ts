import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { Post } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/user.entity';

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
    res.header('jwt_token', req.user.access_token);
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
    res.header('jwt_token', req.user.access_token);
    res.send('OK');
    res.end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  test(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/login')
  async registUser(@Request() req) {
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
      return this.authService.loginToken(user);
    }
    // 그 외의 경우
    return false;
  }
}
