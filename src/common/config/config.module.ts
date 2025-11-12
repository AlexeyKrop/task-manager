import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import jwtConfig from './jwt/jwt.config';
import {AppConfigService} from './app-config-service';
import {JwtConfigService} from './jwt/jwt-config.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [AppConfigService, JwtConfigService],
  exports: [AppConfigService, JwtConfigService],
})
export class JwtConfigModule {}
