import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common';
import { UsersService } from '../users';
import { AuthResponseDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // async login(email: string, password: string): Promise<AuthResponseDto> {
  //   const user = await this.usersService.findByEmail(email);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  //   if (!passwordsMatch) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   return this.generateTokens(user.id, user.email);
  // }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.usersService.create({
      email: signUpDto.email,
      password: hashedPassword,
    });

    return this.generateTokens(user.id, user.email);
  }

  // async refresh(refreshToken: string): Promise<AuthResponseDto> {
  //   try {
  //     const payload = await this.jwtService.verifyAsync(refreshToken, {
  //       secret: jwtConstants.refresh.secret,
  //     });

  //     const user = await this.usersService.findByEmail(payload.email);

  //     if (!user) {
  //       throw new UnauthorizedException('Invalid token');
  //     }

  //     return this.generateTokens(user.id, user.email);
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }
  // }

  // async logout(refreshToken: string): Promise<void> {
  //   await this.refreshTokensRepository.revokeByToken(refreshToken);
  // }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthResponseDto> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refresh.secret,
        expiresIn: jwtConstants.refresh.expiresIn,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
