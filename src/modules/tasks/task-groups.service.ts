import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskGroupsRepository } from './repositories';
import { CreateTaskGroupDto } from './dto';
import { TaskGroup } from './domain';

@Injectable()
export class TaskGroupsService {
  constructor(private readonly taskGroupsRepository: TaskGroupsRepository) {}

  async create(userId: string, dto: CreateTaskGroupDto): Promise<TaskGroup> {
    const groupsCount = await this.taskGroupsRepository.countByUserId(userId);

    const position = dto.position ?? groupsCount;

    return this.taskGroupsRepository.create(dto.name, userId, position);
  }

  async findById(id: string): Promise<TaskGroup> {
    const group = await this.taskGroupsRepository.findById(id);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async findByUserId(userId: string): Promise<TaskGroup[]> {
    return this.taskGroupsRepository.findByUserId(userId);
  }
}
