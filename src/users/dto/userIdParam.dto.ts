import { IsNumberString } from 'class-validator';

export class UserIdParam {
  @IsNumberString()
  user_id: number;
}
