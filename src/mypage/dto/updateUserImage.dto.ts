import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserImageDto {
  @ApiProperty({
    description: '이미지 주소',
    default: 'none',
  })
  @IsString()
  image: string;
}
