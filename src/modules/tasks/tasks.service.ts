import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  async create(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const newTask = {
      id: uuidv4(),
      title,
      description,
    };
    this.tasks.push(newTask);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
