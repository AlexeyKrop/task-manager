import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  JwtConfigModule,
  PrismaModule,
  CookieModule,
  TokenModule,
} from './common';
import { AuthModule, UsersModule, TasksModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    // JwtModule.registerAsync({
    //   global: true,
    //   imports: [JwtConfigModule],
    //   inject: [AppConfigService],
    //   useFactory: (jwtConfigService: JwtConfigService) => ({
    //     secret: jwtConfigService.secret,
    //     signOptions: {
    //       expiresIn: jwtConfigService.accessExpiresIn,
    //     },
    //   }),
    // }),
    TokenModule,
    CookieModule,
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
