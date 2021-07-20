import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async login() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async callback(@Req() req, @Res() res: Response): Promise<any> {
    // 최종적으로 프론트로 보내주는 부분

    res.header('jwtToken', req.user.access_token);
    res.send('OK');
    res.end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  test(@Request() req) {
    console.log(req);

    return req.user;
  }
  // @Post('auth/login')
  // userLogin(@Req req: ) {

  //   // 타입ORM
  // }
}
