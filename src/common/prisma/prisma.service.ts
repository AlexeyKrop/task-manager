import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'colorless',
    });

    this.$on('error', (e) => {
      this.logger.error('Prisma error:', e);
    });

    this.$on('warn', (e) => {
      this.logger.warn('Prisma warning:', e);
    });

    this.$on('info', (e) => {
      this.logger.log('Prisma info:', e);
    });

    this.$on('query', (e) => {
      this.logger.debug('Prisma query:', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
      });
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from database:', error);
    }
  }
}
