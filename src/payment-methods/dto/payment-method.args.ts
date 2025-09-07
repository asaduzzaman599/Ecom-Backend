import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/libs/common/dto/pagination';

export type PaymentMethodPaginatedArgs = Prisma.PaymentMethodWhereUniqueInput &
  PaginationDto;
