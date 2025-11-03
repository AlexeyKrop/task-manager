import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import {CurrentUser} from '../../common/decorators';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto } from './dto';


@Controller('task-groups')
@ApiBearerAuth()
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskGroupDto,
  ) {
    return this.taskGroupsService.create(userId, dto);
  }

  @Get()
  async findMy(@CurrentUser('id') userId: string) {
    return this.taskGroupsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskGroupsService.findById(id);
  }
}