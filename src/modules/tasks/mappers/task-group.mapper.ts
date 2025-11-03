import { Prisma } from '@prisma/client';
import { TaskAuthor, TaskGroup } from '../domain';

type PrismaGroupWithRelations = Prisma.GroupGetPayload<{
  include: {
    user: {
      include: {
        profile: true;
      };
    };
  };
}>;

export class TaskGroupMapper {
    static toDomain(prismaGroup: PrismaGroupWithRelations): TaskGroup {
      return new TaskGroup(
        prismaGroup.id,
        prismaGroup.name,
        prismaGroup.position,
        prismaGroup.userId,
        this.mapOwner(prismaGroup.user),
        prismaGroup.createdAt,
        prismaGroup.updatedAt,
      );
    }

    private static mapOwner(user: PrismaGroupWithRelations['user']): TaskAuthor {
        return new TaskAuthor(
          user.id,
          user.profile?.firstName || '',
          user.profile?.lastName || '',
          user.profile?.avatarUrl || undefined,
        );
      }
  }