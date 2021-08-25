import { UpdateProdcutDTO } from './dto/updateProduct.dto';
import { CreatedCommentDTO } from './dto/createComment.dto';
import { ProductIdParam } from './dto/productIdParam.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatedProductDTO } from './dto/createProduct.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateReCommentDTO } from './dto/createReComment.dto';
import { AppService } from 'src/app.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly appService: AppService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 업로드',
    description: '상품을 업로드 하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  async productUpload(
    @Body() createdProductDTO: CreatedProductDTO,
    @Req() req,
  ): Promise<any> {
    const user = req.user;
    const new_product = await this.productService.createProduct(
      createdProductDTO,
      user,
    );
    if (new_product.success) {
      return new_product;
    } else {
      throw new HttpException(
        {
          success: false,
          message: new_product.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: '거래 지역 가져오기',
    description: '거래 지역을 가져오는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @Get('address')
  async findAllAddress(): Promise<any> {
    const address = await this.productService.getAllAddress();
    if (address.success) {
      return address;
    } else {
      throw new HttpException(
        {
          success: false,
          message: address.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: '카테고리 가져오기',
    description: '카테고리를 가져오는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @Get('category')
  async findAllCategory(): Promise<any> {
    const category = await this.productService.getAllCategory();
    if (category.success) {
      return category;
    } else {
      throw new HttpException(
        {
          success: false,
          message: category.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: '추천상품 가져오기',
    description: '추천상품을 가져오는 API입니다. (미개발, 차후 개발 예정)',
  })
  @Get(':product_id/recommend')
  recommendProduct(@Param() param: ProductIdParam) {
    return 'recommend products';
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 댓글 작성',
    description: '상품댓글을 작성하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/comment')
  async writeComment(
    @Req() req,
    @Body() createdCommentDTO: CreatedCommentDTO,
    @Param() param: ProductIdParam,
  ) {
    const user = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (!product.success) {
      throw new HttpException(
        {
          success: false,
          message: product.message,
        },
        product.statusCode,
      );
    }
    const comment = await this.productService.createComment(
      createdCommentDTO,
      user,
      product.data,
    );

    if (comment.success) {
      const new_notice = await this.appService.createNotice(
        user.user_no,
        product.data.product_no,
        'comment',
      );

      if (new_notice.success) {
        return {
          success: true,
          message: 'Create Comment and Notice Successful',
        };
      } else {
        // 알림생성에서 에러가 나면 댓글을 지우는 로직 추가
        throw new HttpException(
          {
            success: false,
            message: new_notice.message,
          },
          new_notice.statusCode,
        );
      }
    } else {
      throw new HttpException(
        {
          success: false,
          message: 'Create Comment fail',
        },
        comment.statusCode,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 대댓글 작성',
    description: '상품 대댓글을 작성하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
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
    if (comment.success) {
      const result = await this.productService.createReComment(
        user,
        comment.data,
        createReCommentDto,
      );
      if (result.success) {
        const new_notice = await this.appService.createNotice(
          user.user_no,
          param.product_id,
          'recomment',
        );
        if (new_notice.success) {
          return { success: true, message: 'Success' };
        } else {
          throw new HttpException(
            {
              success: false,
              message: new_notice.message,
            },
            new_notice.statusCode,
          );
        }
      } else {
        throw new HttpException(
          {
            success: false,
            message: result.message,
          },
          result.statusCode,
        );
      }
    } else {
      throw new HttpException(
        {
          success: false,
          message: comment.message,
        },
        comment.statusCode,
      );
    }
  }

  // 신고하기
  @Post(':product_id/report')
  reportProduct(@Param() param: ProductIdParam) {
    return 'report a product';
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 찜 하기',
    description: '상품을 찜 하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':product_id/wish')
  async wishProduct(@Req() req: any, @Param() param: ProductIdParam) {
    const user = req.user;
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      throw new HttpException(
        {
          success: false,
          message: product.message,
        },
        product.statusCode,
      );
    }
    const wish = await this.productService.findWishById(
      user.user_no,
      product.data.product_no,
    );
    if (!wish.success) {
      throw new HttpException(
        {
          success: false,
          message: wish.message,
        },
        wish.statusCode,
      );
    }
    const new_wish = await this.productService.createWish(user, product.data);
    if (!new_wish.success) {
      throw new HttpException(
        {
          success: false,
          message: new_wish.message,
        },
        new_wish.statusCode,
      );
    }
    const new_notice = await this.appService.createNotice(
      user.user_no,
      product.data.product_no,
      'wish',
    );
    if (!new_notice.success) {
      throw new HttpException(
        {
          success: false,
          message: new_notice.message,
        },
        new_notice.statusCode,
      );
    }
    return { success: true, message: 'Create Wish and Notice Successful' };
  }

  @ApiOperation({
    summary: '판매자 번호 보내주기',
    description: '판매자 번호를 보내주는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':product_id/seller_num')
  async sendPhoneNumber(@Param() param: ProductIdParam) {
    return await this.productService.findSellerPhoneNum(param.product_id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 수정 하기',
    description: '상품을 수정하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
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

  @ApiOperation({
    summary: '상품 상세 정보',
    description: '상품 상세 정보를 보내주는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @Get(':product_id')
  productInfo(@Param() param: ProductIdParam) {
    return this.productService.findOne(param.product_id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 삭제 하기',
    description: '상품을 삭제하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '상품 찜 취소하기',
    description: '상품 찜을 취소하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
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
