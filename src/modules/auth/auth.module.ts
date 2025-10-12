import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensRepository } from './repositories';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensRepository],
  exports: [AuthService],
})
export class AuthModule {}
