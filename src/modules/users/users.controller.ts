import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {CurrentUser} from '../../common';
import { UsersService } from './users.service';
import { UpdateProfileDto, UserProfileResponseDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  async getMyProfile(
    @CurrentUser() userId: string,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiBearerAuth()
  async updateMyProfile(
    @CurrentUser() userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  async getUserProfile(
    @Param('id') id: string,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile(id, updateProfileDto);
  }
}
