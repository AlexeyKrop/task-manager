import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtConfigService } from './jwt/jwt-config.service';
import jwtConfig from './jwt/jwt.config';
import {CookieService} from './cookie/cookie.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [JwtConfigService, CookieService],
  exports: [JwtConfigService, CookieService],
})
export class JwtConfigModule {}
