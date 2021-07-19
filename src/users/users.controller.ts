import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';

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
  async callback(@Request() req): Promise<any> {
    // 최종적으로 프론트로 보내주는 부분
    return req.user;
    // return this.authService.login(req.user);
  }
}
