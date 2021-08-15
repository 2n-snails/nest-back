import { IsNotEmpty, IsString } from 'class-validator';

export class SearchProductDTO {
  @IsString()
  @IsNotEmpty()
  search: string;
}
