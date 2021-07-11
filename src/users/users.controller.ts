import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';

@Controller('users')
export class UsersController {
  // 카카오 로그인 실행
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  kakaoLogin() {
    return process.env.KAKAO_KEY;
  }
  // 카카오 로그인 콜백
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakaocallback')
  kakaocallback(@Res() res) {
    // 토큰 생성 기능 추가 예정
    res.redirect('http://localhost:4000');
  }
}
