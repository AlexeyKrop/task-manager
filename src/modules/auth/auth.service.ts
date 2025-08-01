import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants';
import { UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;

    const passwordsMatch = await bcrypt.compare(pass, password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.userId, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refresh.secret,
      expiresIn: jwtConstants.refresh.expiresIn,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
