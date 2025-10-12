import { UserProfile as PrismaUserProfile } from '@prisma/client';
import { UserProfile } from '../domain';

export class UserProfileMapper {
  static toDomain(prismaProfile: PrismaUserProfile): UserProfile {
    return new UserProfile(
      prismaProfile.firstName,
      prismaProfile.lastName,
      prismaProfile.phone,
      prismaProfile.bio,
      prismaProfile.avatarUrl,
    );
  }
}
