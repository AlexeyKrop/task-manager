import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service'; // или откуда у тебя PrismaService
import { RefreshToken } from '../domain';
import { RefreshTokenMapper } from '../mappers';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const prismaToken = await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return RefreshTokenMapper.toDomain(prismaToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const prismaToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return prismaToken ? RefreshTokenMapper.toDomain(prismaToken) : null;
  }

  async revoke(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });
  }

  async revokeByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
