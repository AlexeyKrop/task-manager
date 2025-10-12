import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';
import { JwtConfigService } from './jwt-config.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
