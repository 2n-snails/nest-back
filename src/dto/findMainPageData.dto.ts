import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class FindMainPageDataDTO {
  @IsString()
  @IsIn(['createdAt', 'wish', 'deal'], {
    message: 'createdAt, wish, deal 만 입력 가능',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['createdAt', 'wish', 'deal'] })
  sort: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ default: 15 })
  limit: number;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ default: 1 })
  page: number;
}
