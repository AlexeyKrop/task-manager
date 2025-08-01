import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;
  @IsString()
  @Optional()
  description: string;
}
