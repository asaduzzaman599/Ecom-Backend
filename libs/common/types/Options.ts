import { Prisma } from '@prisma/client';
import { RequestWithUser } from './request-with-user';

export type Options = {
  tx?: Prisma.TransactionClient;
  context?: RequestWithUser;
};
