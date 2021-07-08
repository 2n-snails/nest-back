import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export enum SortType {
  created_at = 'created_at',
  wishs = 'wishs',
  deals = 'deals',
}

export class QueryStringDto {
  @ApiProperty({
    name: 'sort',
    enum: SortType,
    description: '정렬 조건',
  })
  @IsEnum(SortType)
  public sort: SortType;

  @ApiProperty({
    name: 'limit',
    example: 20,
    description: '가져올 상품 개수',
  })
  @IsInt()
  @Type(() => Number)
  public limit: number;

  @ApiProperty({
    name: 'page',
    example: 1,
    description: '페이지 번호',
  })
  @IsInt()
  @Type(() => Number)
  public page: number;
}
