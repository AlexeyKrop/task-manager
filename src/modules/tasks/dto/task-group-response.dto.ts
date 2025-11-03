import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TaskGroupOwnerDto {
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
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: TaskGroupOwnerDto })
  owner?: TaskGroupOwnerDto;
}