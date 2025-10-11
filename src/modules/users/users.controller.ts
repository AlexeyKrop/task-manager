import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators';
import { UserProfileResponseDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getProfile(
    @CurrentUser() userId: string,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(userId);
  }
}
