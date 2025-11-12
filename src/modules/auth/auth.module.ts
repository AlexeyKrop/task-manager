import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensRepository } from './repositories';
import {CookieModule, JwtConfigModule, TokenModule} from '../../common';

@Module({
  imports: [UsersModule, JwtConfigModule, TokenModule, CookieModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensRepository],
  exports: [AuthService],
})
export class AuthModule {}
