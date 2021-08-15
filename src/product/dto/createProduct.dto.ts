import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatedProductDTO {
  @IsString()
  @MaxLength(50, {
    message: 'The maximum length of the title is 50',
  })
  @IsNotEmpty()
  readonly product_title: string;

  @IsString()
  @MaxLength(200, {
    message: 'The maximum length of the content is 200',
  })
  @IsNotEmpty()
  readonly product_content: string;

  @IsString()
  readonly product_price: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: '상품 이미지는 한개 이상 필수 등록입니다.',
  })
  readonly images: string[];

  @IsArray()
  @ArrayMinSize(1, {
    message: '상품 카테고리는 한개 이상 필수 등록입니다.',
  })
  readonly productCategories: string[];
}
