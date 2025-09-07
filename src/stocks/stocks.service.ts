import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StockCreateDto } from './dto/stock-create.dto';
import { Prisma } from '@prisma/client';
import { MasterService } from 'libs/master/master.service';
import { StockPaginatedArgs } from './dto/stocks.args';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class StocksService {
  constructor(private readonly customPrisma: MasterService) {}
  create(createDto: StockCreateDto, option?: { tx: Prisma.TransactionClient }) {
    return (option?.tx ?? this.customPrisma).stock.create({
      data: createDto,
    });
  }

  createMany(
    createDto: StockCreateDto[],
    option?: { tx: Prisma.TransactionClient },
  ) {
    return (option?.tx ?? this.customPrisma).stock.createMany({
      data: createDto,
    });
  }

  async findAllByArgs(
    args?: StockPaginatedArgs,
    select?: Prisma.StockSelect<DefaultArgs>,
  ) {
    try {
      const { limit: take, page, search, ...query } = args;
      const skip = page * take - take;

      const searchQueries = {
        OR: [].map((i) => ({
          [i]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      };

      const queries: Prisma.StockFindManyArgs = {
        ...(query
          ? {
              where: {
                ...searchQueries,
                ...query,
              },
            }
          : null),
        ...(select ? { select } : null),
        skip,
        take,
      };
      const [stocks, count] = await Promise.all([
        this.customPrisma.stock.findMany(queries),
        this.customPrisma.stock.count({
          ...(query ? { where: queries.where } : null),
          select: {
            _all: true,
          },
        }),
      ]);

      return {
        items: stocks,
        total: count._all,
        hasNextPage: count._all / take > page,
        hasPreviousPage: page > 1,
        page,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
