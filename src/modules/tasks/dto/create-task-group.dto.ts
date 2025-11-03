import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateTaskGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    position?: number;
  }