import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskGroupsRepository } from './repositories';
import { CreateTaskGroupDto, TaskGroupResponseDto } from './dto';
import { TaskGroup } from './domain';
import {TaskGroupMapper} from './mappers';

@Injectable()
export class TaskGroupsService {
  constructor(private readonly taskGroupsRepository: TaskGroupsRepository) {}

  async create(userId: string, dto: CreateTaskGroupDto): Promise<TaskGroupResponseDto> {
    const groupsCount = await this.taskGroupsRepository.countByUserId(userId);

    const position = dto.position ?? groupsCount;
    const group = await this.taskGroupsRepository.create(dto.name, userId, position);

    return TaskGroupMapper.toResponse(group);
  }

  async findById(id: string): Promise<TaskGroupResponseDto> {
    const group = await this.taskGroupsRepository.findById(id);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return TaskGroupMapper.toResponse(group);
  }

  async findByUserId(userId: string): Promise<TaskGroupResponseDto[]> {
    const groups = await this.taskGroupsRepository.findByUserId(userId);
    return groups.map(group => TaskGroupMapper.toResponse(group));
  }
}
