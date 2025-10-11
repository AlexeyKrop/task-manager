import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories';
import { User } from './domain';
import { UserMapper } from './mappers';
import { UserProfileResponseDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create({
    email,
    passwordHash,
  }: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.usersRepository.create(email, passwordHash);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  private async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getProfile(id: string): Promise<UserProfileResponseDto> {
    const user = await this.findById(id);
    return UserMapper.toResponse(user);
  }
}
