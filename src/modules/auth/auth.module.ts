import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { getJwtConstants } from '../../common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensRepository } from './repositories';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: getJwtConstants().access.secret,
      signOptions: { expiresIn: getJwtConstants().access.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensRepository],
  exports: [AuthService],
})
export class AuthModule {}
