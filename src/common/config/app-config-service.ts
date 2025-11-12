import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) { }

    get nodeEnv(): string {
        return this.configService.get<string>('NODE_ENV', 'development');
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get isDevelopment(): boolean {
        return !this.isProduction;
    }

    get allowedOrigins(): string[] {
        const raw = this.configService.get<string>('ALLOWED_ORIGINS') || '';
        const origins = raw.split(',').map(s => s.trim()).filter(Boolean);
        return origins.length ? origins : ['http://localhost:5173'];
    }

    get port(): number {
        return Number(this.configService.get<number>('PORT', 3000));
    }
}
