import { SearchProductDTO } from './dto/searchProduct.dto';
import { FindMainPageDataDTO } from './dto/findMainPageData.dto';
import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('common')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '메인 페이지',
    description: '메인 페이지를 보여주는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @Get('main')
  async mainPageData(@Query() findMainPageDataDTO: FindMainPageDataDTO) {
    const { sort, limit, page } = findMainPageDataDTO;
    const mainData = await this.appService.getMainPageData(sort, limit, page);
    return mainData;
  }

  @ApiOperation({
    summary: '상품 검색',
    description: '상품검색을 하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @Post('search')
  async searchProduct(@Req() req, @Body() searchProductDTO: SearchProductDTO) {
    return this.appService.productSearch(searchProductDTO);
  }
}
