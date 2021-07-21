import { Controller, Get } from '@nestjs/common';

@Controller('api/v1')
export class AppController {
  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Get('search')
  productSearch() {
    return 'Search Product';
  }
}
