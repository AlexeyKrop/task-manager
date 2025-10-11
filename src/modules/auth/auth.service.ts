import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import {
  SignUpResponseDto,
  SignUpDto,
  SignInResponseDto,
  SignInDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dto';
import { RefreshTokensRepository } from './repositories';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const { email, password } = signUpDto;

      this.logger.log(`Attempting to sign up user with email: ${email}`);

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersService.create({
        email: email,
        passwordHash: hashedPassword,
      });

      this.logger.log(`User created successfully with ID: ${user.id}`);
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      this.logger.error(`Sign up failed for email ${signUpDto.email}:`, error.stack);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    try {
      const { email, password } = signInDto;

      this.logger.log(`Attempting to sign in user with email: ${email}`);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        this.logger.warn(`Sign in failed: User with email ${email} not found`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordsMatch) {
        this.logger.warn(`Sign in failed: Invalid password for email ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User signed in successfully with ID: ${user.id}`);
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      this.logger.error(`Sign in failed for email ${signInDto.email}:`, error.stack);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to sign in user');
    }
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refresh_token } = refreshTokenDto;
    let payload;
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenInDb =
      await this.refreshTokensRepository.findByToken(refresh_token);

    if (!tokenInDb) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (tokenInDb.isExpired()) {
      await this.refreshTokensRepository.deleteByToken(refresh_token);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokensRepository.deleteByToken(refresh_token);

    return this.generateTokens(payload.sub, payload.email);
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<SignUpResponseDto> {
    try {
      const payload = { sub: userId, email };

      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const refreshExpiresIn = this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
      );

      if (!refreshSecret) {
        this.logger.error('JWT_REFRESH_SECRET is not configured');
        throw new InternalServerErrorException('JWT configuration error');
      }

      this.logger.log(`Generating tokens for user ${userId}`);

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
          secret: refreshSecret,
          expiresIn: refreshExpiresIn,
        }),
      ]);

      const expiresAt = new Date();
      const daysMatch = refreshExpiresIn?.match(/(\d+)d/);
      if (daysMatch) {
        expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1]));
      } else {
        const hoursMatch = refreshExpiresIn?.match(/(\d+)h/);
        if (hoursMatch) {
          expiresAt.setHours(expiresAt.getHours() + parseInt(hoursMatch[1]));
        } else {
          expiresAt.setDate(expiresAt.getDate() + 7);
        }
      }

      await this.refreshTokensRepository.create({
        token: refreshToken,
        userId,
        expiresAt,
      });

      this.logger.log(`Tokens generated successfully for user ${userId}`);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.logger.error(`Failed to generate tokens for user ${userId}:`, error.stack);
      throw new InternalServerErrorException('Failed to generate authentication tokens');
    }
  }
}
