import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TaskGroupOwnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  avatarUrl?: string;
}

export class TaskGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: TaskGroupOwnerDto })
  owner?: TaskGroupOwnerDto;
}