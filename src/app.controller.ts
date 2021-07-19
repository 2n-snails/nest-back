import { AuthService } from './auth/auth.service';
import { NaverAuthGuard } from './auth/guard/naver-auth.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Get('search')
  productSearch() {
    return 'Search Product';
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async login() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async callback(@Request() req): Promise<any> {
    // 최종적으로 프론트로 보내주는 부분
    // return req.user;
    // return this.authService.login(req.user);
    if (req.user) {
      console.log('유저가 있어요');
      return req.user;
    } else {
      console.log('유저가 없어요');
      return 'hi';
    }
  }
}
