import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserProfileRepository, UsersRepository } from './repositories';
import { User } from './domain';
import { UserMapper } from './mappers';
import { UpdateProfileDto, UserProfileResponseDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profileRepository: UserProfileRepository,
  ) {}

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
    const profile = await this.profileRepository.findByUserId(id);

    return UserMapper.toResponse(user, profile);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.findById(userId);

    const profile = await this.profileRepository.upsert(
      userId,
      updateProfileDto,
    );

    return UserMapper.toResponse(user, profile);
  }
}
