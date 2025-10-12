import { User as PrismaUser } from '@prisma/client';
import { User, UserProfile } from '../domain';
import { UserProfileResponseDto } from '../dto';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }

  static toDomains(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }

  static toResponse(
    user: User,
    profile?: UserProfile | null,
  ): UserProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      firstName: profile?.firstName ?? undefined,
      lastName: profile?.lastName ?? undefined,
      phone: profile?.phone ?? undefined,
      bio: profile?.bio ?? undefined,
      avatarUrl: profile?.avatarUrl ?? undefined,
    };
  }
}
