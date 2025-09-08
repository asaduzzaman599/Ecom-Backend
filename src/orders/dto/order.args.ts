import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/libs/common/dto/pagination';

export type OrderPaginatedArgs = Prisma.OrderWhereInput & PaginationDto;
export type OrderArgs = Prisma.OrderWhereInput;
