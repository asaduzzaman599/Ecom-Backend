import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class MasterService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    this.$use(this.loggingMiddleware);
  }
  loggingMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      return next({
        ...params,
        action: 'findFirst',
        args: {
          ...params.args,
          where: {
            ...params.args?.where,
            deleted: false,
          },
        },
      });
    }

    if (params.action === 'findMany') {
      return next({
        ...params,
        args: {
          ...params.args,
          where: {
            deleted: false,
            ...params.args?.where,
          },
        },
      });
    }

    if (params.action === 'delete') {
      return next({
        ...params,
        action: 'update',
        args: {
          ...params.args,
          data: {
            deleted: true,
          },
        },
      });
    }

    return next(params);
  };

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
