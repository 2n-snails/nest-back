import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SearchDto } from './common/dto/search.dto';
import { QueryStringDto } from './common/dto/sort.dto';

@ApiTags('Main')
@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 메인 페이지 라우터
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiOperation({ summary: '메인페이지 데이터 조회' })
  @Get('main')
  mainPageData(@Query() query: QueryStringDto) {
    return 'main page data';
  }

  // 검색 라우터
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiOperation({ summary: '상품 검색 기능' })
  @Get('search')
  productsearch(@Query() query: SearchDto) {
    return 'search product';
  }
}
