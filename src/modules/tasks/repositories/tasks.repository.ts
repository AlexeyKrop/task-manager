import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common";
import { Task, TaskAuthor, TaskGroup } from "../domain";
import { TaskMapper } from "../mappers";

@Injectable()
export class TasksRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(name: string, userId: string): Promise<TaskGroup> {
        const prismaGroup = await this.prisma.group.create({
          data: {
            name,
            userId,
          },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });

        return new TaskGroup(prismaGroup.id, prismaGroup.name, new TaskAuthor(prismaGroup.userId, prismaGroup.name, '', ''), prismaGroup.createdAt, prismaGroup.updatedAt);
    }

    async createTask(
        title: string,
        ownerId: string,
        groupId: string,
        options?: {
          description?: string;
          status?: string;
          priority?: string;
          position?: number;
          tags?: string[];
          parentId?: string;
        }
      ): Promise<Task> {
        const prismaTask = await this.prisma.task.create({
          data: {
            title,
            description: options?.description,
            status: options?.status || 'TODO',
            priority: options?.priority || 'MEDIUM',
            position: options?.position ?? 0,
            tags: options?.tags || [],
            ownerId,
            groupId,
            parentId: options?.parentId,
          },
          include: {
            owner: {
              include: {
                profile: true,
              },
            },
            group: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
            children: {
              include: {
                owner: {
                  include: {
                    profile: true,
                  },
                },
                group: {
                  include: {
                    user: {
                      include: {
                        profile: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return TaskMapper.toDomain(prismaTask);
    }
}