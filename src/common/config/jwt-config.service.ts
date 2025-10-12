import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

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

    // Дефолт - 7 дней
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
  }
}
