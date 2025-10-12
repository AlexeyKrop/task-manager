import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import { UserProfile } from '../domain';
import { UserProfileMapper } from '../mappers';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    const prismaProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    return prismaProfile ? UserProfileMapper.toDomain(prismaProfile) : null;
  }

  async upsert(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const prismaProfile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: {
        ...data,
      },
    });

    return UserProfileMapper.toDomain(prismaProfile);
  }
}
