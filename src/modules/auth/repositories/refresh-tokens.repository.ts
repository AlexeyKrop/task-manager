import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import { RefreshToken } from '../domain';
import { RefreshTokenMapper } from '../mappers';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const prismaToken = await this.prisma.refreshToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
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

  async findAllByUserId(userId: string): Promise<RefreshToken[]> {
    const prismaTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return RefreshTokenMapper.toDomains(prismaTokens);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
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

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
