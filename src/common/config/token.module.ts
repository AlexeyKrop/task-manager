import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {AppConfigService, JwtConfigModule, JwtConfigService} from '.';
import {JwtModule} from '@nestjs/jwt';

@Global()
@Module({
imports: [
    JwtModule.registerAsync({
        global: true,
        imports: [JwtConfigModule],
        inject: [AppConfigService],
        useFactory: (jwtConfigService: JwtConfigService) => ({
          secret: jwtConfigService.secret,
          signOptions: {
            expiresIn: jwtConfigService.accessExpiresIn,
          },
        }),
      }),
],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
