import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../common";
import {TaskGroup} from "../domain";
import {TaskGroupMapper} from "../mappers";

@Injectable()
export class TaskGroupsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(name: string, userId: string, position: number): Promise<TaskGroup> {
        const prismaGroup = await this.prisma.group.create({
            data: {
                name,
                userId,
                position,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return TaskGroupMapper.toDomain(prismaGroup);
    }

    async findById(id: string): Promise<TaskGroup | null> {
        const prismaGroup = await this.prisma.group.findUnique({
            where: {id},
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!prismaGroup) return null;

        return TaskGroupMapper.toDomain(prismaGroup);
    }

    async findByUserId(userId: string): Promise<TaskGroup[]> {
        const prismaGroups = await this.prisma.group.findMany({
            where: {userId},
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                position: 'asc',
            },
        });

        return prismaGroups.map((group) => TaskGroupMapper.toDomain(group));
    }

    async countByUserId(userId: string): Promise<number> {
        return this.prisma.group.count({
            where: {userId},
        });
    }

    async deleteWithTasks(groupId: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.task.deleteMany({where: {groupId}});
            await tx.group.delete({where: {id: groupId}});
        });
    }

    async deleteEmpty(groupId: string): Promise<void> {
        await this.prisma.group.delete({where: {id: groupId}});
    }

    async countTasksInGroup(groupId: string): Promise<number> {
        return this.prisma.task.count({
          where: {groupId}
        });
      }
}

