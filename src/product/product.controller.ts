import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  Res,
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
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/recomment')
  async writeReComment(@Req() req, @Body() data, @Param('product_id') id) {
    const user = req.user;
    const comment = await this.productService.findCommentById(data.comment_no);
    if (!comment) {
      return {
        message: 'This comment does not exist',
        success: false,
      };
    }
    const result = await this.productService.createReComment(
      user,
      comment,
      data,
      id,
    );
    if (result) {
      return { success: true, message: 'ReComment successful' };
    }
    throw new InternalServerErrorException();
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
  @Get(':product_id/seller-num')
  async sendPhoneNumber(@Param('product_id') id: number) {
    return await this.productService.findSellerPhoneNum(id);
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
