import { Body, Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(JwtAuthGuard)
  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Post('search')
  async searchProduct(@Req() req, @Body() data) {
    return this.appService.productSearch(data);
  }
}
