import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileRepository, UsersRepository } from './repositories';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserProfileRepository],
  exports: [UsersService],
})
export class UsersModule {}
