import { Body, Controller, Get, Req, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Post('search')
  async searchProduct(@Req() req, @Body() data) {
    return this.appService.productSearch(data);
  }
}
