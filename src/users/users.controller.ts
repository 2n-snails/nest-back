import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async login() {
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

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  test(@Request() req) {
    return req.user;
  }
}
