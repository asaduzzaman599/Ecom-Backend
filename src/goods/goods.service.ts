import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MasterService } from 'libs/master/master.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { GoodsPaginatedArgs } from './dto/goods.arg';

@Injectable()
export class GoodsService {
  constructor(private readonly customPrisma: MasterService) {}
  create(createGoodDto: CreateGoodDto) {
    return this.customPrisma.goods.create({
      data: createGoodDto,
    });
  }

  findAll(
    args?: Prisma.GoodsWhereUniqueInput,
    select?: Prisma.GoodsSelect<DefaultArgs>,
  ) {
    return this.customPrisma.goods.findUnique({
      ...(args ? { where: args } : null),
      // ...(select ? { select } : null),
      include: {
        category: true,
      },
    });
  }

  async findAllByArgs(
    args?: GoodsPaginatedArgs,
    select?: Prisma.GoodsSelect<DefaultArgs>,
  ) {
    try {
      const { limit: take, page, search, ...query } = args;
      const skip = page * take - take;

      const searchQueries = {
        OR: ['title'].map((i) => ({
          [i]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      };

      const queries: Prisma.GoodsFindManyArgs = {
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
      const [types, count] = await Promise.all([
        this.customPrisma.goods.findMany(queries),
        this.customPrisma.goods.count({
          ...(query ? { where: queries.where } : null),
          select: {
            _all: true,
          },
        }),
      ]);

      return {
        items: types,
        total: count._all,
        hasNextPage: count._all / take > page,
        hasPreviousPage: page > 1,
        page,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  findOne(
    args: Prisma.GoodsWhereUniqueInput,
    select?: Prisma.GoodsSelect<DefaultArgs>,
  ) {
    return this.customPrisma.goods.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updateGoodDto: UpdateGoodDto) {
    const exist = await this.findOne({ id });

    if (!exist) throw new NotFoundException('Products not found!');

    return this.customPrisma.goods.update({
      where: { id },
      data: updateGoodDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });

    if (!exist) throw new NotFoundException('Products not found!');

    return this.customPrisma.goods.delete({
      where: { id },
    });
  }
}
