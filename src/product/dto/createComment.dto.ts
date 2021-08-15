import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatedCommentDTO {
  @IsString()
  @MaxLength(200, {
    message: '최대 길이는 200입니다.',
  })
  @IsNotEmpty()
  comment_content: string;
}
