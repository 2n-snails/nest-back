import { UpdateProdcutDTO } from './dto/updateProduct.dto';
import { CreatedCommentDTO } from './dto/createComment.dto';
import { Injectable } from '@nestjs/common';
import { CreatedProductDTO } from './dto/createProduct.dto';
import { getConnection } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Product } from 'src/entity/product.entity';
import { CreateReCommentDTO } from './dto/createReComment.dto';
import { CreateProductService } from './query/createProduct.service';
import { User } from 'src/entity/user.entity';
import { ReadProductService } from './query/readProduct.service';
import { UpdateProductService } from './query/updateProduct.service';
import { AddressCity } from 'src/entity/address_city.entity';
import { Category } from 'src/entity/category.entity';
import { DeleteProductService } from './query/deleteProduct.service';
import { Wish } from 'src/entity/wish.entity';
@Injectable()
export class ProductService {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly readProductService: ReadProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  async findProductById(product_no: number): Promise<Product> {
    return await this.readProductService.findProductById(product_no);
  }

  async createProduct(
    createdProductDTO: CreatedProductDTO,
    user: User,
  ): Promise<any> {
    return await this.createProductService.createProduct(
      createdProductDTO,
      user,
    );
  }

  async findOne(product_no: number) {
    return await this.readProductService.findproductOne(product_no);
  }

  async findCommentById(comment_no: number): Promise<any> {
    return await this.readProductService.findCommentOne(comment_no);
  }

  async createComment(
    createdCommentDTO: CreatedCommentDTO,
    user: User,
    product: Product,
  ) {
    return await this.createProductService.createComment(
      createdCommentDTO,
      user,
      product,
    );
  }

  async createReComment(
    user: User,
    comment: Comment,
    createReCommentDto: CreateReCommentDTO,
  ) {
    return await this.createProductService.createRecomment(
      user,
      comment,
      createReCommentDto,
    );
  }

  // 판매자 전화번호 보내주기
  async findSellerPhoneNum(product_no: number): Promise<Product> {
    return await this.readProductService.findPhoneNumber(product_no);
  }
  async findWishById(user_no, product_id): Promise<boolean> {
    return this.readProductService.findWishById(user_no, product_id);
  }

  async createWish(user: User, product: Product) {
    return this.createProductService.createWish(user, product);
  }

  async deleteWish(user_no: number, product_id: number) {
    return this.deleteProductService.deleteWish(user_no, product_id);
  }

  async deleteProduct(user_no: number, product_id: number) {
    return await this.deleteProductService.deleteProduct(user_no, product_id);
  }

  // 상품의 판매자 정보 찾기
  async findUserByProduct(product_no: number) {
    return await this.readProductService.findUserbyProduct(product_no);
  }

  async updateProduct(updateProdcutDTO: UpdateProdcutDTO, product_no: number) {
    const product = await this.readProductService.findProductById(product_no);
    if (!product) {
      return false;
    }
    return await this.updateProductService.updateProduct(
      updateProdcutDTO,
      product,
    );
  }

  async getAllAddress(): Promise<AddressCity[]> {
    return await this.readProductService.findAddress();
  }

  async getAllCategory(): Promise<Category[]> {
    return await this.readProductService.findCategory();
  }
}
