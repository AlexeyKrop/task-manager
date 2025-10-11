import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './common';
import { AuthModule, UsersModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
})
export class AppModule {}
