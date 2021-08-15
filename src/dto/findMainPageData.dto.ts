import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class FindMainPageDataDTO {
  @IsString()
  @IsIn(['createdAt', 'wish', 'deal'], {
    message: 'createdAt, wish, deal 만 입력 가능',
  })
  @IsNotEmpty()
  sort: string;

  @IsNumberString()
  @IsNotEmpty()
  limit: number;

  @IsNumberString()
  @IsNotEmpty()
  page: number;
}
