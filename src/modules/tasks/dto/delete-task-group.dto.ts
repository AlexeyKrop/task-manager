import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsBoolean, IsOptional} from "class-validator";

export class DeleteTaskGroupDto {
    @ApiPropertyOptional({
      description: 'Force delete group with all tasks',
      default: false,
    })
    @IsOptional()
    @IsBoolean()
    force?: boolean;
  }