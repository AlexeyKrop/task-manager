import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensRepository } from './repositories';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // imports: [
  //   UsersModule,
  //   JwtModule.register({
  //     global: true,
  //     secret: getJwtConstants().access.secret,
  //     signOptions: { expiresIn: getJwtConstants().access.expiresIn },
  //   }),
  // ],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

        console.log('🔧 JWT Module Configuration:');
        console.log(`JWT_SECRET exists: ${!!secret}`);
        console.log(`JWT_SECRET length: ${secret?.length || 0}`);
        console.log(`JWT_EXPIRES_IN: ${expiresIn}`);

        if (!secret) {
          console.error('❌ JWT_SECRET is not configured');
          throw new Error('JWT_SECRET is not configured');
        }

        if (secret.length < 32) {
          console.warn('⚠️ JWT_SECRET is too short (recommended: 32+ characters)');
        }

        console.log('✅ JWT Module configured successfully');

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensRepository],
  exports: [AuthService],
})
export class AuthModule {}
