import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UserIdParam {
  @ApiProperty({ description: '유저 아이디' })
  @IsNumberString()
  user_id: number;
}
