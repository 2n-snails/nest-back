import { UpdateProdcutDTO } from './dto/updateProduct.dto';
import { CreatedCommentDTO } from './dto/createComment.dto';
import { ProductIdParam } from './dto/productIdParam.dto';
import { ApiTags } from '@nestjs/swagger';
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
import { AppService } from 'src/app.service';
import { CreateReCommentDTO } from './dto/createReComment.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly appService: AppService,
  ) {}
  // 상품 업로드
  @Roles(userLevel.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  async productUpload(
    @Body() createdProductDTO: CreatedProductDTO,
    @Req() req,
  ) {
    const user = req.user;
    const result = await this.productService.createProduct(
      createdProductDTO,
      user,
    );
    if (result) {
      return { suceess: true, message: 'Product Upload Success' };
    } else {
      throw new InternalServerErrorException();
    }
  }

  // 상품 상세 정보
  @Get(':product_id')
  productInfo(@Param() param: ProductIdParam) {
    return this.productService.findOne(param.product_id);
  }

  // 추천 상품
  @Get(':product_id/recommend')
  recommendProduct(@Param() param: ProductIdParam) {
    return 'recommend products';
  }

  // 상품 댓글 작성
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/comment')
  async writeComment(
    @Req() req,
    @Body() createdCommentDTO: CreatedCommentDTO,
    @Param() param: ProductIdParam,
  ) {
    const user = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      return {
        message: 'This product does not exist',
        success: false,
      };
    }
    const result = await this.productService.createComment(
      user,
      createdCommentDTO,
      product,
    );
    if (result) {
      await this.appService.createNotice(
        user.user_no,
        param.product_id,
        'comment',
      );
      return { success: true, message: 'Comment successful' };
    }
    throw new InternalServerErrorException();
  }

  // 대댓글 작성
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/recomment')
  async writeReComment(
    @Req() req,
    @Body() createReCommentDto: CreateReCommentDTO,
    @Param() param: ProductIdParam,
  ) {
    const user = req.user;
    const comment = await this.productService.findCommentById(
      createReCommentDto.comment_no,
    );
    if (!comment) {
      return {
        message: 'This comment does not exist',
        success: false,
      };
    }
    const result = await this.productService.createReComment(
      user,
      comment,
      createReCommentDto,
      param.product_id,
    );
    if (result) {
      await this.appService.createNotice(
        user.user_no,
        param.product_id,
        'recomment',
      );
      return { success: true, message: 'ReComment successful' };
    }
    throw new InternalServerErrorException();
  }

  // 신고하기
  @Post(':product_id/report')
  reportProduct(@Param() param: ProductIdParam) {
    return 'report a product';
  }

  // 찜하기
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/wish')
  async wishProduct(@Req() req: any, @Param() param: ProductIdParam) {
    const { user_no } = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      return {
        message: 'no product',
        success: false,
      };
    }
    const user = await this.productService.findWishById(
      user_no,
      param.product_id,
    );
    if (!user) {
      await this.productService.createWish(user_no, param.product_id);
      await this.appService.createNotice(user_no, param.product_id, 'wish');
      return {
        message: 'wish successful',
        success: true,
      };
    }
    return {
      message: 'already exist',
      success: false,
    };
  }

  // 판매자 번호 보내주기
  @Get(':product_id/seller_num')
  async sendPhoneNumber(@Param() param: ProductIdParam) {
    return await this.productService.findSellerPhoneNum(param.product_id);
  }

  // 상품 수정
  @UseGuards(JwtAuthGuard)
  @Put(':product_id/update')
  async productInfoUpdate(
    @Req() req,
    @Body() updateProdcutDTO: UpdateProdcutDTO,
    @Param() param: ProductIdParam,
  ) {
    const { user_no } = req.user;
    const result = await this.productService.findUserByProduct(
      param.product_id,
    );
    const productUpdate =
      result.user_no === user_no
        ? await this.productService.updateProduct(
            updateProdcutDTO,
            param.product_id,
          )
        : {
            success: false,
            message: 'You do not have permission to edit this product',
          };
    return productUpdate;
  }

  // 상품 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':product_id')
  async deleteProduct(@Req() req: any, @Param() param: ProductIdParam) {
    const { user_no } = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (product) {
      const isSuccess = await this.productService.deleteProduct(
        user_no,
        param.product_id,
      );
      if (isSuccess.affected === 0) {
        return {
          message: 'no result',
          success: false,
        };
      }
      return {
        message: 'product delete successful',
        success: true,
      };
    }
    return {
      message: 'no product',
      success: false,
    };
  }

  // 찜 취소하기
  @UseGuards(JwtAuthGuard)
  @Delete(':product_id/wish')
  async wishCancleProduct(@Req() req: any, @Param() param: ProductIdParam) {
    const { user_no } = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      return {
        message: 'no product',
        success: false,
      };
    }
    const user = await this.productService.findWishById(
      user_no,
      param.product_id,
    );
    // 유저가 있다면
    if (user) {
      this.productService.deleteWish(user_no, param.product_id);
      return {
        message: 'wish successful',
        success: true,
      };
    }
    // 찜한게 없다면
    return {
      message: 'no wish',
      success: true,
    };
  }
}
