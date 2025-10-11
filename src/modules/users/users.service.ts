import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories';
import { User } from './domain';
import { UserMapper } from './mappers';
import { UserProfileResponseDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create({
    email,
    passwordHash,
  }: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    try {
      this.logger.log(`Attempting to create user with email: ${email}`);

      this.logger.log(`Checking if user already exists`);
      const existingUser = await this.usersRepository.findByEmail(email);
      if (existingUser) {
        this.logger.warn(`User with email ${email} already exists`);
        throw new ConflictException('User with this email already exists');
      }

      this.logger.log(`Creating new user in database`);
      const user = await this.usersRepository.create(email, passwordHash);
      this.logger.log(`User created successfully with ID: ${user.id}`);

      return user;
    } catch (error) {
      this.logger.error(`Failed to create user with email ${email}:`, error.stack);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create user in database');
    }
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
