import { SearchProductDTO } from './dto/searchProduct.dto';
import { FindMainPageDataDTO } from './dto/findMainPageData.dto';
import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('common')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('main')
  async mainPageData(@Query() findMainPageDataDTO: FindMainPageDataDTO) {
    const { sort, limit, page } = findMainPageDataDTO;
    const mainData = await this.appService.getMainPageData(sort, limit, page);
    return mainData;
  }

  @Post('search')
  async searchProduct(@Req() req, @Body() searchProductDTO: SearchProductDTO) {
    return this.appService.productSearch(searchProductDTO);
  }
}
