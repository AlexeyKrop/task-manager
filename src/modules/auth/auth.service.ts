import {
  ConflictException,
  Injectable,
  UnauthorizedException,
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
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password } = signUpDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email: email,
      passwordHash: hashedPassword,
    });

    return this.generateTokens(user.id, user.email);
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
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
    const payload = { sub: userId, email };

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

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

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
