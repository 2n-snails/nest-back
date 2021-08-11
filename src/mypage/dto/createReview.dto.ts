import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: '리뷰 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '이미지 주소',
  })
  @IsString()
  imageSrc: string;

  @ApiProperty({
    description: '리뷰 점수',
  })
  @IsNumber()
  reviewScore: number;
}
