import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MypageService } from './mypage.service';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}
  // 유저의 찜 목록
  @UseGuards(JwtAuthGuard)
  @Get('my_wish/:user_id')
  async wishList(@Req() req, @Param('user_id') user_id: number) {
    const result = await this.mypageService.findUserWish(user_id);
    return result;
  }

  // 유저의 판매중인 상품
  @UseGuards(JwtAuthGuard)
  @Get('my_product/:user_id')
  async productList(@Req() req, @Param('user_id') user_id: number) {
    const result = await this.mypageService.findUserProduct(user_id);
    return result;
  }

  // 유저의 리뷰 목록
  @Get('my-review/:user-id')
  reviewList() {
    return 'review list';
  }

  // 내 정보
  @Get('my-info/:user-id')
  myInfo() {
    return 'my info';
  }

  // 리뷰 작성하기
  @Post('review-write/:user-id')
  writeReview() {
    return 'write review';
  }

  // 프로필 사진 변경
  @Patch('my-info/:user-id/image')
  userProfileImageUpdate() {
    return 'update image';
  }

  // 유저 닉네임 수정
  @UseGuards(JwtAuthGuard)
  @Patch('my-info/:user_id/nickname')
  async userNickNameUpdate(
    @Req() req,
    @Param('user_id') id: number,
    @Body() data,
  ) {
    const userIdChecking: boolean = req.user.user_no === id;

    if (userIdChecking) {
      const result = await this.mypageService.userNickUpdate(data, id);
      if (result) {
        return {
          success: true,
          message: 'User nickname modification successful',
        };
      }
      return { success: false, message: 'Failed to modify user nickname' };
    }
    throw new ForbiddenException(
      'The user information and the user ID in the url do not match.',
    );
  }

  // 프로필 사진 삭제
  @Delete('my-info/:user-id/image')
  userProfileImageDelete() {
    return 'delede image';
  }

  // 회원 탈퇴
  @Delete('my-info/:user-id')
  wihteDrawMember() {
    return 'withdraw member';
  }

  // 리뷰 삭제
  @Delete('review-delete/:review-id')
  reviewDelete() {
    return 'review delete';
  }
}
