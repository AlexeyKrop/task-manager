import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators';
import { UserMapper } from './mappers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() userId: string) {
    const user = await this.usersService.findById(userId);
    return UserMapper.toResponse(user);
  }
}
