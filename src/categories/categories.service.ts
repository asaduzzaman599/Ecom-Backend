import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MasterService } from 'libs/master/master.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryPaginatedArgs } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private customPrisma: MasterService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exist = await this.customPrisma.category.findFirst({
      where: {
        title: createCategoryDto.title,
      },
    });

    if (exist) throw new ConflictException('Already Exist!');

    return this.customPrisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(
    args?: Prisma.CategoryWhereUniqueInput,
    select?: Prisma.CategorySelect<DefaultArgs>,
  ) {
    return await this.customPrisma.category.findMany({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async findAllByArgs(
    args?: CategoryPaginatedArgs,
    select?: Prisma.CategorySelect<DefaultArgs>,
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

      const queries: Prisma.CategoryFindManyArgs = {
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

      const [categories, count] = await Promise.all([
        this.customPrisma.category.findMany(queries),
        this.customPrisma.category.count({
          ...(query ? { where: queries.where } : null),
          select: {
            _all: true,
          },
        }),
      ]);

      return {
        items: categories,
        total: count._all,
        hasNextPage: count._all / take > page,
        hasPreviousPage: page > 1,
        page,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(
    args?: Prisma.CategoryWhereUniqueInput,
    select?: Prisma.CategorySelect<DefaultArgs>,
  ) {
    return await this.customPrisma.category.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Category not found!');

    return this.customPrisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Category not found!');

    return this.customPrisma.category.delete({
      where: {
        id,
      },
    });
  }
}
