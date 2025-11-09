import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',


  cookie: {
    path: process.env.COOKIE_PATH || '/api/auth',
    sameSite: (process.env.COOKIE_SAME_SITE || 'strict') as 'strict' | 'lax' | 'none',
    domain: process.env.COOKIE_DOMAIN,
  },
}));
