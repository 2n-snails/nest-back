import { Controller, Get } from '@nestjs/common';

@Controller()
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
