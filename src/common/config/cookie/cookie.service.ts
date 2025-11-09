import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtConfigService } from '../jwt/jwt-config.service';

@Injectable()
export class CookieService {
  constructor(private readonly jwtConfig: JwtConfigService) {}

  setRefreshToken(response: Response, token: string): void {
    response.cookie('refreshToken', token, {
      httpOnly: true,
      secure: this.jwtConfig.isProduction,
      sameSite: this.jwtConfig.cookieSameSite,
      maxAge: this.jwtConfig.calculateMaxAge(),
      path: this.jwtConfig.cookiePath,
      domain: this.jwtConfig.cookieDomain,
    });
  }

  clearRefreshToken(response: Response): void {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.jwtConfig.isProduction,
      sameSite: this.jwtConfig.cookieSameSite,
      path: this.jwtConfig.cookiePath,
      domain: this.jwtConfig.cookieDomain,
    });
  }

  getRefreshToken(request: Request): string | undefined {
    return request.cookies?.['refreshToken'];
  }
}