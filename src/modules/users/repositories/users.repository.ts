import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common';
import { User } from '../domain';
import { UserMapper } from '../mappers';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, passwordHash: string): Promise<User> {
    try {
      this.logger.log(`Executing Prisma user.create for email: ${email}`);

      const prismaUser = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      this.logger.log(`Prisma user.create successful, ID: ${prismaUser.id}`);
      return UserMapper.toDomain(prismaUser);
    } catch (error) {
      this.logger.error(`Prisma user.create failed for email ${email}:`, error.stack);
      throw error;
    }
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
