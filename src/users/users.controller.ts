import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('auth/login')
  login() {
    return 'Login Service';
  }
  @Get('findOne')
  findOne() {
    return this.userService.findUserByEmail('gangsuyun6@gmail.com');
  }
}
