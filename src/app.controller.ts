import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('main')
  async mainPageData(@Query() query) {
    const { sort, limit, page } = query;
    const mainData = await this.appService.getMainPageData(sort, limit, page);
    return mainData;
  }

  @Post('search')
  async searchProduct(@Req() req, @Body() data) {
    return this.appService.productSearch(data);
  }
}
