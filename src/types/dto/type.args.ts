import { Prisma } from '@prisma/client';
import { PaginationArgs } from 'libs/common/types/pagination.args';

export type TypePaginatedArgs = Prisma.TypeWhereInput & PaginationArgs;
