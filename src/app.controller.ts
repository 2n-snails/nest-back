import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('common')
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
