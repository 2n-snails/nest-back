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
    const product_upload = await this.productService.createProduct(
      createdProductDTO,
      user,
    );
    if (product_upload) {
      return { success: true, message: 'upload product successful' };
    } else {
      return { success: false, message: 'upload product failed' };
    }
  }

  @ApiOperation({
    summary: '거래 지역 가져오기',
    description: '거래 지역을 가져오는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '정상 요청',
  })
  @Get('address')
  async findAllAddress(): Promise<any> {
    const address = await this.productService.getAllAddress();
    return address.length !== 0
      ? { success: true, data: address }
      : { success: false, data: address };
  }

  @ApiOperation({
    summary: '카테고리 가져오기',
    description: '카테고리를 가져오는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '정상 요청',
  })
  @Get('category')
  async findAllCategory(): Promise<any> {
    const category = await this.productService.getAllCategory();
    return category.length !== 0
      ? { success: true, data: category }
      : { success: false, data: category };
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
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `no product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.productService.createComment(createdCommentDTO, user, product);

    await this.appService.createNotice(
      user.user_no,
      product.product_no,
      'comment',
    );
    return {
      success: true,
      message: 'Create Comment and Notice Successful',
    };
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
    const { comment_no } = createReCommentDto;
    const comment = await this.productService.findCommentById(comment_no);
    if (!comment.success) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `No Comment number ${comment_no}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `no product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.productService.createReComment(
      user,
      comment.data,
      createReCommentDto,
    );
    if (result) {
      await this.appService.createNotice(
        user.user_no,
        param.product_id,
        'recomment',
      );
      return { success: true, message: 'create recomment successful' };
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
          status: HttpStatus.NOT_FOUND,
          message: `No product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const wish = await this.productService.findWishById(
      user.user_no,
      product.product_no,
    );
    if (wish) {
      return { success: false, message: 'already added' };
    }
    const new_wish = await this.productService.createWish(user, product);
    if (new_wish) {
      await this.appService.createNotice(
        user.user_no,
        param.product_id,
        'wish',
      );
      return { success: true, message: 'create wish successful' };
    }
  }
  @ApiBearerAuth('access-token')
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
    const product = await this.productService.findProductById(param.product_id);
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `No product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const phone_number = await this.productService.findSellerPhoneNum(
      product.product_no,
    );
    if (!phone_number) {
      return { success: true, data: phone_number, message: 'no phone number' };
    }
    return { success: true, data: phone_number };
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
    const product = await this.productService.findUserByProduct(
      param.product_id,
    );
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `No product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (product.user_no !== user_no) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const productUpdate = await this.productService.updateProduct(
      updateProdcutDTO,
      param.product_id,
    );

    if (productUpdate) {
      return { success: true, message: 'product update successful' };
    } else {
      return { success: false, message: 'product update failed' };
    }
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
  async productInfo(@Param() param: ProductIdParam) {
    const product = await this.productService.findOne(param.product_id);
    if (product.length === 0) {
      return { success: true, message: 'No product', data: product };
    } else {
      return { success: true, data: product };
    }
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
    const product = await this.productService.findUserByProduct(
      param.product_id,
    );
    if (!product) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `No product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user_no !== product.user_no) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const delete_product = await this.productService.deleteProduct(
      user_no,
      param.product_id,
    );
    if (delete_product.affected === 0) {
      return {
        success: false,
        message: 'product delete failed',
      };
    } else {
      return {
        success: true,
        message: 'product delete successful',
      };
    }
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `No product number ${param.product_id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.productService.findWishById(
      user_no,
      param.product_id,
    );

    if (!user) {
      return {
        success: true,
        message: 'no on the wish list',
      };
    }

    await this.productService.deleteWish(user_no, param.product_id);
    return {
      message: 'wish successful',
      success: true,
    };
  }
}
