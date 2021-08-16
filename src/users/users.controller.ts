import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { NaverAuthGuard } from '../auth/guard/naver-auth.guard';
import {
  Body,
  Controller,
  Get,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { Post } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refreshToken-auth.guard';
import { RegistUserDTO } from './dto/registUser.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '네이버 로그인',
    description: '네이버 로그인을 하는 API입니다.',
  })
  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async naverlogin() {
    return;
  }

  @ApiOperation({
    summary: '네이버 로그인 콜백',
    description: '네이버 로그인시 콜백 라우터입니다.',
  })
  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async callback(@Req() req, @Res() res: Response): Promise<any> {
    res.cookie('access_token', req.user.access_token);
    res.cookie('refresh_token', req.user.refresh_token);
    res.redirect('http://localhost:3000/auth/singup');
    res.end();
    // 리다이렉트 해주는 페이지
  }

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 하는 API입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return;
  }

  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인시 콜백 라우터입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaocallback(@Req() req, @Res() res: Response) {
    res.cookie('access_token', req.user.access_token);
    res.cookie('refresh_token', req.user.refresh_token);
    res.redirect('http://localhost:3000/auth/singup');
    res.end();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @UseGuards(JwtAuthGuard)
  @Post('auth/login')
  async registUser(@Request() req: any, @Body() registUserDTO: RegistUserDTO) {
    try {
      const { user_email, user_nick, user_provider, user_token } = req.user;
      const { user_tel, user_privacy } = registUserDTO;
      // 1회용 토큰인경우
      if (user_token === 'onceToken') {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            user_email,
            user_tel,
            user_nick,
            user_provider,
            user_privacy,
          })
          .execute();
        const user = await this.authService.validateUser(user_email);
        await this.authService.createLoginToken(user);
        await this.authService.createRefreshToken(user);
        return { success: true, message: 'user login successful' };
      }
    } catch (error) {
      console.log(error);
    }
    // 그 외의 경우
    return false;
  }
  // 리프레쉬 토큰을 이용한 엑세스 토큰 재발급하기
  @UseGuards(JwtRefreshGuard)
  @Get('auth/refresh-accesstoken')
  async refreshAccessToken() {
    return { success: true, message: 'new accessToken Issuance success' };
  }
}
