import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Wish } from 'src/entity/wish.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class MypageService {
  // 유저 닉네임 수정하기
  async userNickUpdate(data, user_no) {
    const { user_nick } = data;
    try {
      const result = await getRepository(User)
        .createQueryBuilder()
        .update(User, { user_nick: user_nick })
        .returning('*')
        .where(`user_no = ${user_no}`)
        .updateEntity(true)
        .execute();
      if (result.affected > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return e;
    }
  }
  // 유저 찜 목록
  async findUserWish(user_id) {
    const result = await getRepository(Wish)
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.product', 'product')
      .where(`wish.user = ${user_id}`)
      .getMany();
    return result;
  }
}
