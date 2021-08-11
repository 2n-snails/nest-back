import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserNickDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  @IsString()
  userNick: string;
}
