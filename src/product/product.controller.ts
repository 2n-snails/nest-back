import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Put,
} from '@nestjs/common';
import { CreatedProdutcDTO } from './dto/createProduct.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // 상품 업로드
  @Post('upload')
  async productUpload(@Body() data: CreatedProdutcDTO) {
    console.log(data);
    const result = await this.productService.createProduct(data);
    if (result) {
      return { suceess: true, message: 'Product Upload Success' };
    } else {
      throw new InternalServerErrorException();
    }
  }

  // 상품 상세 정보
  @Get(':product-id')
  productInfo() {
    return 'product info';
  }

  // 추천 상품
  @Get(':product-id/recommend')
  recommendProduct() {
    return 'recommend products';
  }

  // 상품 댓글 작성
  @Post(':product-id/comment')
  writeComment() {
    return 'write Comment';
  }

  // 대댓글 작성
  @Post(':product-id/recomment')
  writeReComment() {
    return 'write ReComment';
  }

  // 신고하기
  @Post(':product-id/report')
  declareProduct() {
    return 'declare a product';
  }

  // 찜하기
  @Post(':product-id/wish')
  wishProduct() {
    return 'wish product';
  }

  // 판매자 번호 보내주기
  @Post(':product-id/seller-num')
  sendPhoneNumber() {
    return 'send phone number';
  }

  // 상품 수정
  @Put(':product-id/update')
  productInfoUpdate() {
    return 'product update';
  }

  // 상품 삭제
  @Delete(':product-id')
  deletedProduct() {
    return 'delete product';
  }

  // 찜 취소하기
  @Delete(':product-id/wish')
  wishCancleProduct() {
    return 'wish product';
  }
}
