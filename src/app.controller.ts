import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Get('search')
  productSearch() {
    return 'Search Product';
  }
}
