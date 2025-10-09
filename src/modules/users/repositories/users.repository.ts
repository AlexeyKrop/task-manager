import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common';
import { User } from '../domain';
import { UserMapper } from '../mappers';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, passwordHash: string): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return UserMapper.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }
}
