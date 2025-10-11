import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
