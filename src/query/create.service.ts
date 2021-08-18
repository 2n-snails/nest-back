import { HttpException, Injectable } from '@nestjs/common';
import { Notice } from 'src/entity/notice.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class CreateAppService {
  async createNotice(
    writer_no,
    product_no: number,
    notice_type: string,
    reciver,
  ) {
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Notice)
        .values([
          {
            notice_type,
            notice_target_no: product_no,
            writer: writer_no,
            receiver: reciver.user_no,
          },
        ])
        .execute();
      return { success: true };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        500,
      );
    }
  }
}
