import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { QueryStringDto } from './sort.dto';

export enum SearchType {
  all = 'all',
  location = 'location',
  product = 'product',
}

export class SearchDto extends PickType(QueryStringDto, [
  'limit',
  'page',
] as const) {
  @ApiProperty({
    name: 'search',
    example: '청바지',
    description: '검색 정보',
  })
  @IsString()
  public search: string;

  @ApiProperty({
    name: 'type',
    enum: SearchType,
    description: '검색 조건',
  })
  @IsEnum(SearchType)
  public type: SearchType;
}
