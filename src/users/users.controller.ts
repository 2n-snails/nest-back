import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('auth/login')
  login() {
    return 'Login Service';
  }
}
