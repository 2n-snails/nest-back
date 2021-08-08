import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('main')
  async mainPageData(@Query() query) {
    const mainData = await this.appService.getMainPageData(query);
    return mainData;
  }

  @Post('search')
  async searchProduct(@Req() req, @Body() data) {
    return this.appService.productSearch(data);
  }
}
