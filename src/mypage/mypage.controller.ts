import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('mypage')
export class MypageController {
  // 유저의 찜 목록
  @Get('my-wish/:user-id')
  wishList() {
    return 'wish list';
  }

  // 유저의 판매중인 상품
  @Get('my-product/:user-id')
  productOnSale() {
    return 'product on sale';
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
  @Patch('my-info/:user-id/nickname')
  userNickNameUpdate() {
    return 'nickname update';
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
