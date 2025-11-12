// import {Injectable} from '@nestjs/common';
// import {ConfigService} from '@nestjs/config';
// import {JwtService} from '@nestjs/jwt';

// @Injectable()
// export class JwtConfigService {
//     constructor(
//         private readonly configService: ConfigService,
//         private readonly jwtService: JwtService,
//     ) { }

//     get secret(): string {
//         return this.configService.getOrThrow<string>('jwt.secret');
//     }

//     get refreshSecret(): string {
//         return this.configService.getOrThrow<string>('jwt.refreshSecret');
//     }

//     get accessExpiresIn(): string {
//         return this.configService.getOrThrow<string>('jwt.accessExpiresIn');
//     }

//     get refreshExpiresIn(): string {
//         return this.configService.getOrThrow<string>('jwt.refreshExpiresIn');
//     }

//     get cookiePath(): string {
//         return this.configService.getOrThrow<string>('jwt.cookie.path');
//     }

//     get cookieSameSite(): 'strict' | 'lax' | 'none' {
//         return this.configService.getOrThrow<'strict' | 'lax' | 'none'>(
//             'jwt.cookie.sameSite',
//         );
//     }

//     get cookieDomain(): string | undefined {
//         return this.configService.get<string>('jwt.cookie.domain');
//     }

//     get isProduction(): boolean {
//         return process.env.NODE_ENV === 'production';
//     }

//     get allowedOrigins(): string[] {
//         const origins = (this.configService.get<string>('ALLOWED_ORIGINS') || '')
//           .split(',')
//           .map(origin => origin.trim())
//           .filter(Boolean);

//         return origins.length ? origins : ['http://localhost:5173'];
//       }

//     async decodeAndVerifyToken(token: string): Promise<{
//         sub: string;
//         email?: string;

//     }> {
//         const payload = await this.jwtService.verifyAsync(token, {
//             secret: this.secret,
//         });
//         return payload
//     }

//     calculateExpiresAt(expiresIn: string = this.refreshExpiresIn): Date {
//         const expiresAt = new Date();

//         const daysMatch = expiresIn.match(/(\d+)d/);
//         if (daysMatch) {
//             expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1]));
//             return expiresAt;
//         }

//         const hoursMatch = expiresIn.match(/(\d+)h/);
//         if (hoursMatch) {
//             expiresAt.setHours(expiresAt.getHours() + parseInt(hoursMatch[1]));
//             return expiresAt;
//         }

//         const minutesMatch = expiresIn.match(/(\d+)m/);
//         if (minutesMatch) {
//             expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(minutesMatch[1]));
//             return expiresAt;
//         }

//         expiresAt.setDate(expiresAt.getDate() + 7);
//         return expiresAt;
//     }

//     calculateMaxAge(expiresIn: string = this.refreshExpiresIn): number {
//         const expiresAt = this.calculateExpiresAt(expiresIn);
//         return expiresAt.getTime() - Date.now();
//     }
// }


import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class JwtConfigService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    get secret(): string {
        return this.configService.getOrThrow<string>('jwt.secret');
    }

    get refreshSecret(): string {
        return this.configService.getOrThrow<string>('jwt.refreshSecret');
    }

    get accessExpiresIn(): string {
        return this.configService.getOrThrow<string>('jwt.accessExpiresIn');
    }

    get refreshExpiresIn(): string {
        return this.configService.getOrThrow<string>('jwt.refreshExpiresIn');
    }

    get cookiePath(): string {
        return this.configService.getOrThrow<string>('jwt.cookie.path');
    }

    get cookieSameSite(): 'strict' | 'lax' | 'none' {
        return this.configService.getOrThrow<'strict' | 'lax' | 'none'>('jwt.cookie.sameSite');
    }

    get cookieDomain(): string | undefined {
        return this.configService.get<string>('jwt.cookie.domain');
    }

    calculateExpiresAt(expiresIn: string = this.refreshExpiresIn): Date {
        const expiresAt = new Date();

        const daysMatch = expiresIn.match(/(\d+)d/);
        if (daysMatch) {
            expiresAt.setDate(expiresAt.getDate() + parseInt(daysMatch[1]));
            return expiresAt;
        }

        const hoursMatch = expiresIn.match(/(\d+)h/);
        if (hoursMatch) {
            expiresAt.setHours(expiresAt.getHours() + parseInt(hoursMatch[1]));
            return expiresAt;
        }

        const minutesMatch = expiresIn.match(/(\d+)m/);
        if (minutesMatch) {
            expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(minutesMatch[1]));
            return expiresAt;
        }

        expiresAt.setDate(expiresAt.getDate() + 7);
        return expiresAt;
    }


    calculateMaxAge(expiresIn: string = this.refreshExpiresIn): number {
        const expiresAt = this.calculateExpiresAt(expiresIn);
        return expiresAt.getTime() - Date.now();
    }
}
