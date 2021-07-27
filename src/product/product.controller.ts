import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles, userLevel } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreatedProductDTO } from './dto/createProduct.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // 상품 업로드
  @Roles(userLevel.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  async productUpload(@Body() data: CreatedProductDTO, @Req() req) {
    const user = req.user;
    const result = await this.productService.createProduct(data, user);
    if (result) {
      return { suceess: true, message: 'Product Upload Success' };
    } else {
      throw new InternalServerErrorException();
    }
  }

  // 상품 상세 정보
  @Get(':product_id')
  productInfo(@Param() params) {
    return this.productService.findOne(params.product_id);
  }

  // 추천 상품
  @Get(':product-id/recommend')
  recommendProduct() {
    return 'recommend products';
  }

  // 상품 댓글 작성
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/comment')
  async writeComment(
    @Req() req,
    @Body() data,
    @Param('product_id') id: number,
  ) {
    const user = req.user;
    const product = await this.productService.findProductById(id);
    if (!product) {
      return {
        message: 'This product does not exist',
        success: false,
      };
    }
    const result = await this.productService.createComment(user, data, product);
    if (result) {
      return { success: true, message: 'Comment successful' };
    }
    throw new InternalServerErrorException();
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
