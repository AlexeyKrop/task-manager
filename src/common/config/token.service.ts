import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {JwtConfigService} from './jwt/jwt-config.service';


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly jwtConfig: JwtConfigService,
    ) { }

    async generateAccessToken(payload: object): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.jwtConfig.secret,
            expiresIn: this.jwtConfig.accessExpiresIn,
        });
    }

    async generateRefreshToken(payload: object): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.jwtConfig.refreshSecret,
            expiresIn: this.jwtConfig.refreshExpiresIn,
        });
    }

    async verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync(token, {secret: this.jwtConfig.secret});
    }

    async verifyRefreshToken(token: string) {
        return this.jwtService.verifyAsync(token, {secret: this.jwtConfig.refreshSecret});
    }
}
