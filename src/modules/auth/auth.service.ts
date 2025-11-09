import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { JwtConfigService } from '../../common';
import {
  SignUpDto,
  SignInDto,
} from './dto';
import { RefreshTokensRepository } from './repositories';

interface TokenPair {
    access_token: string;
    refresh_token: string;
  }

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<TokenPair> {
    const { email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email: email,
      passwordHash: hashedPassword,
    });

    return this.generateTokens(user.id, user.email);
  }

  async signIn(signInDto: SignInDto): Promise<TokenPair> {
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

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfigService.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenInDb =
      await this.refreshTokensRepository.findByToken(refreshToken);

    if (!tokenInDb) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (tokenInDb.isExpired()) {
      await this.refreshTokensRepository.deleteByToken(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokensRepository.deleteByToken(refreshToken);

    return this.generateTokens(payload.sub, payload.email);
  }

  async logout(refreshToken: string, userId: string): Promise<void> {
    const tokenInDb =
      await this.refreshTokensRepository.findByToken(refreshToken);

    if (!tokenInDb) {
      return;
    }

    if (tokenInDb.userId !== userId) {
      throw new ForbiddenException('Cannot logout with another user token');
    }

    await this.refreshTokensRepository.deleteByToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokensRepository.deleteAllByUserId(userId);
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfigService.refreshSecret,
        expiresIn: this.jwtConfigService.refreshExpiresIn,
      }),
    ]);

    const expiresAt = this.jwtConfigService.calculateExpiresAt();

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
