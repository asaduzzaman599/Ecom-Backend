import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StockCreateDto } from './dto/stock-create.dto';
import { Prisma } from '@prisma/client';
import { MasterService } from 'libs/master/master.service';
import { StockPaginatedArgs } from './dto/stocks.args';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { StockUpdateDto } from './dto/stock-update.dto';

@Injectable()
export class StocksService {
  constructor(private readonly customPrisma: MasterService) {}
  async create(
    createDto: StockCreateDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    const exist = await this.findAll({
      goodId: createDto.goodId,
      size: createDto.size,
      color: createDto.color,
    });

    if (exist.length > 0)
      throw new ConflictException(
        `Stock already exist! ${exist[0].good.title} : ${exist[0].size} : ${exist[0].color}`,
      );

    const dto = {
      ...createDto,
      quantity: 0,
    };

    return (option?.tx ?? this.customPrisma).stock.create({
      data: dto,
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

  findOne(args?: Prisma.StockWhereUniqueInput) {
    return this.customPrisma.stock.findUnique({
      ...(args ? { where: args } : null),
      include: {
        good: true,
      },
    });
  }

  findAll(args?: Prisma.StockWhereInput) {
    return this.customPrisma.stock.findMany({
      ...(args ? { where: args } : null),
      include: {
        good: true,
      },
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

  update(
    id: string,
    updateStockDto: StockUpdateDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    const { quantity, damageQuantity, ...dto } = updateStockDto;

    const updateDto: Prisma.StockUpdateInput = {
      ...dto,
      quantity: {
        increment: quantity,
        ...(damageQuantity ? { increment: damageQuantity } : null),
      },
    };

    return (option?.tx ?? this.customPrisma).stock.update({
      where: { id },
      data: updateDto,
    });
  }
}
