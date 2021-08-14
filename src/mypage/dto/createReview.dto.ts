import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: '리뷰 내용',
    example: 'Swagger 리뷰 작성하기 테스트',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '이미지 주소',
    example: 'example.png',
  })
  @IsString()
  imageSrc: string;

  @ApiProperty({
    description: '리뷰 점수',
    example: 3,
  })
  @IsNumberString()
  reviewScore: number;
}
