import {
  IsBooleanString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegistUserDTO {
  @IsString()
  @MaxLength(20, {
    message: '최대 길이는 20입니다.',
  })
  @IsNotEmpty()
  user_tel: string;

  @IsBooleanString({
    message: 'true 또는 false의 값만 들어올수 있습니다.',
  })
  @IsNotEmpty()
  user_privacy: boolean;
}
