import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('main')
  mainPageData() {
    return 'Main Page Router';
  }

  @Get('search')
  productSearch() {
    return 'Search Product';
  }
}
