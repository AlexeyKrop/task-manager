import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  async create(createTaskDto: CreateTaskDto): Promise<string> {
    const { title, description } = createTaskDto;
    const createTaskId = uuidv4();
    const newTask = {
      id: createTaskId,
      title,
      description,
    };
    this.tasks.push(newTask);
    return createTaskId;
  }

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findOne(id: string): Promise<Task> {
    const foundTask = this.tasks.find((item) => item.id === id);
    if (!foundTask) throw new NotFoundException(`Task ${id} not found`);
    return foundTask;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
