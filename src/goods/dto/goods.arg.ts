import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/libs/common/dto/pagination';

export type GoodsPaginatedArgs = Prisma.GoodsWhereInput & PaginationDto;
