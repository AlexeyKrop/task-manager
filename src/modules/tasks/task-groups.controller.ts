import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import {CurrentUser} from '../../common/decorators';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto, TaskGroupResponseDto } from './dto';


@Controller('task-groups')
@ApiBearerAuth()
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskGroupDto,
  ): Promise<TaskGroupResponseDto> {
    return this.taskGroupsService.create(userId, dto);
  }

  @Get()
  async findMy(@CurrentUser('id') userId: string): Promise<TaskGroupResponseDto[]> {
    return this.taskGroupsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskGroupResponseDto> {
    return this.taskGroupsService.findById(id);
  }

  @Delete(':id')
  deleteTaskGroup(
    @Param('id') id: string,
    @Query('force') force?: string,
  ) {
    return this.taskGroupsService.deleteTaskGroup(id, force === 'true');
  }
}