import { RefreshToken as PrismaRefreshToken } from '@prisma/client';
import { RefreshToken } from '../domain';

export class RefreshTokenMapper {
  static toDomain(prismaToken: PrismaRefreshToken): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.token,
      prismaToken.userId,
      prismaToken.expiresAt,
      prismaToken.createdAt,
      prismaToken.isRevoked,
    );
  }

  static toDomains(prismaTokens: PrismaRefreshToken[]): RefreshToken[] {
    return prismaTokens.map((token) => this.toDomain(token));
  }
}
