import { ApiTags } from '@nestjs/swagger';
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

@ApiTags('mypage')
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

  // 유저에게 달린 리뷰 목록
  @Get('my_review/:user_id')
  async reviewList(@Req() req, @Param('user_id') user_id: number) {
    const result = await this.mypageService.findUserReview(user_id);
    return result;
  }

  // 내 정보
  @UseGuards(JwtAuthGuard)
  @Get('my_info/:user_id')
  async myInfo(@Req() req, @Param('user_id') user_id: number) {
    const result = await this.mypageService.findMyInfo(user_id);
    return result;
  }

  // 리뷰 작성하기
  @UseGuards(JwtAuthGuard)
  // 링크 user_id는 리뷰 받는 사람
  @Post('review_write/:user_id')
  async writeReview(@Req() req, @Param('user_id') user_id: number) {
    const writer = req.user.user_no;
    const { content, imageSrc, reviewScore } = req.body;
    await this.mypageService.writeReview(
      writer,
      user_id,
      content,
      imageSrc,
      reviewScore,
    );
    return {
      success: true,
      message: 'review write success',
    };
  }

  // 프로필 사진 변경
  @UseGuards(JwtAuthGuard)
  @Patch('my_info/:user_id/image')
  async userProfileImageUpdate(@Req() req, @Param('user_id') user_id: number) {
    const image = req.body.image;
    return this.mypageService.userProfileImageUpdate(user_id, image);
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

  // 회원 탈퇴
  @UseGuards(JwtAuthGuard)
  @Delete('my_info/:user_id')
  async deleteUser(@Req() req, @Param('user_id') user_id: number) {
    const user_no = req.user.user_no;
    return this.mypageService.userDelete(user_no);
  }

  // 리뷰 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('review_delete/:review_id')
  deleteReview(@Req() req, @Param('review_id') review_id: number) {
    const writer = req.user.user_no;
    return this.mypageService.reviewDelete(writer, review_id);
  }
}
