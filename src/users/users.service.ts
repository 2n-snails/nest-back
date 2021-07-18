import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class UsersService {
  async findOne(user_email: string): Promise<User | undefined> {
    const user = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.user_email = :user_email', { user_email })
      .getOne();
    return user;
  }
}
