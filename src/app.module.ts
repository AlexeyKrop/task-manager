import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  JwtConfigModule,
  JwtConfigService,
  PrismaModule,
} from './common';
import { AuthModule, UsersModule, TasksModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: {
          expiresIn: jwtConfigService.accessExpiresIn,
        },
      }),
    }),
    JwtConfigModule,
    PrismaModule,

    AuthModule,
    UsersModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
