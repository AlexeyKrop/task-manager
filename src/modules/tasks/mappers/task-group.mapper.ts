import {Prisma} from '@prisma/client';
import {TaskAuthor, TaskGroup} from '../domain';
import {TaskGroupResponseDto} from '../dto';

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
            prismaGroup.createdAt,
            prismaGroup.updatedAt,
            'user' in prismaGroup && prismaGroup.user
              ? this.mapOwner(prismaGroup.user)
              : undefined,
          );
    }

    static toDomains(
        prismaGroups: (PrismaGroupWithRelations)[],
    ): TaskGroup[] {
        return prismaGroups.map((group) => this.toDomain(group));
    }

    static toResponse(group: TaskGroup): TaskGroupResponseDto {
        return {
            id: group.id,
            name: group.name,
            position: group.position,
            ownerId: group.ownerId,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            owner: group.owner
                ? {
                    firstName: group.owner.firstName,
                    lastName: group.owner.lastName,
                    fullName: group.owner.getFullName(),
                    avatarUrl: group.owner.avatarUrl,
                }
                : undefined,
        };
    }

    private static mapOwner(user: PrismaGroupWithRelations['user']): TaskAuthor {
        return new TaskAuthor(
            user.profile?.firstName || '',
            user.profile?.lastName || '',
            user.profile?.avatarUrl || undefined,
        );
    }
}