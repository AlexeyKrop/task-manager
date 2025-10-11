import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common';
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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
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
      password: hashedPassword,
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
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: jwtConstants.refresh.secret,
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

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refresh.secret,
        expiresIn: jwtConstants.refresh.expiresIn,
      }),
    ]);

    const expiresAt = new Date();
    const daysMatch = jwtConstants.refresh.expiresIn.match(/(\d+)d/);
    if (daysMatch) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1]));
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
