import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReCommentDTO {
  @IsInt()
  @IsNotEmpty()
  comment_no: number;

  @IsString()
  @MaxLength(200, {
    message: '최대 길이는 200입니다.',
  })
  @IsNotEmpty()
  recomment_content: string;
}
