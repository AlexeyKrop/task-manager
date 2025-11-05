import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  priority: string;
  @IsString()
  @IsNotEmpty()
  groupId: string;
  @IsNumber()
  @IsNotEmpty()
  position: number;
  @IsString()
  @IsOptional()
  tags: string[];
}