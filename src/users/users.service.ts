import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class UsersService {
  async findUserByEmail(user_email: string): Promise<User | undefined> {
    const user = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.user_email = :user_email', { user_email })
      .getOne();
    return user;
  }

  async findUserById(user_no: number): Promise<User | undefined> {
    const user = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.user_no = :user_no', { user_no })
      .getOne();
    return user;
  }
}
