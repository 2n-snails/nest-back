import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { NaverStrategy } from './strategy/naver.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, NaverStrategy],
})
export class AuthModule {}
