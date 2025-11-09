import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateTaskGroupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'Position tasks group in list',
        example: 1,
      })
    @IsNumber()
    @IsNotEmpty()
    position: number;
  }