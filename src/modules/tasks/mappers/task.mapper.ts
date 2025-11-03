import { Prisma } from '@prisma/client';
import { Task, TaskGroup, TaskAuthor, TaskAttachment, TaskComment } from '../domain';

type PrismaTaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    owner: {
      include: {
        profile: true;
      };
    };
    group: {
      include: {
        user: {
          include: {
            profile: true;
          };
        };
      };
    };
    children: {
      include: {
        owner: {
          include: {
            profile: true;
          };
        };
        group: {
          include: {
            user: {
              include: {
                profile: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export class TaskMapper {
//   static toDomain(data: PrismaTaskWithRelations): Task {
//     return new Task(
//       data.id,
//       data.title,
//       this.mapAuthor(data.owner),
//       data.status,
//       data.priority,
//       this.mapGroup(data.group),
//       data.position,
//       data.createdAt,
//       data.updatedAt,
//       data.description || '',
//       data.tags || [],
//       [],
//       [],
//       this.mapChildren(data.children || []),
//     );
//   }

//   private static mapAuthor(owner: PrismaTaskWithRelations['owner']): TaskAuthor {
//     return new TaskAuthor(
//       owner.id,
//       owner.profile?.firstName || '',
//       owner.profile?.lastName || '',
//       owner.profile?.avatarUrl || undefined,
//     );
//   }

//   private static mapGroup(group: PrismaTaskWithRelations['group']): TaskGroup {
//     return new TaskGroup(
//       group.id,
//       group.name,
//       this.mapAuthor(group.user),
//       group.createdAt,
//       group.updatedAt,
//     );
//   }

//   private static mapChildren(
//     children: PrismaTaskWithRelations['children'],
//   ): Task[] {
//     return children.map((child) => {
//       return new Task(
//         child.id,
//         child.title,
//         this.mapAuthor(child.owner),
//         child.status,
//         child.priority,
//         this.mapGroup(child.group),
//         child.position,
//         child.createdAt,
//         child.updatedAt,
//         child.description || '',
//         child.tags || [],
//         [],
//         [],
//         [],
//       );
//     });
//   }
}