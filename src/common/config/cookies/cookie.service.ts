import {Injectable} from '@nestjs/common';
import {Response, Request} from 'express';
import {AppConfigService} from '../app-config-service';
import {JwtConfigService} from '../jwt/jwt-config.service';

@Injectable()
export class CookieService {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly jwtConfig: JwtConfigService,
    ) { }
    setRefreshToken(options: {response: Response; token: string}): void {
        const {response, token} = options;
        response.cookie('refreshToken', token, {
            httpOnly: true,
            secure: this.appConfig.isProduction,
            sameSite: this.jwtConfig.cookieSameSite,
            maxAge: this.jwtConfig.calculateMaxAge(),
            path: this.jwtConfig.cookiePath,
            domain: this.jwtConfig.cookieDomain,
        });
    }

    clearRefreshToken(response: Response): void {
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.appConfig.isProduction,
            sameSite: this.jwtConfig.cookieSameSite,
            path: this.jwtConfig.cookiePath,
            domain: this.jwtConfig.cookieDomain,
        });
    }

    getRefreshToken(request: Request): string | undefined {
        return request.cookies?.['refreshToken'];
    }
}
