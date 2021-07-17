import { NaverAuthGuard } from './auth/guard/naver-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  async callback(): Promise<any> {
    return;
  }
}
