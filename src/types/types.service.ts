import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { TypePaginatedArgs } from './dto/type.args';

@Injectable()
export class TypesService {
  constructor(private customPrisma: MasterService) {}

  create(createTypeDto: CreateTypeDto) {
    return this.customPrisma.type.create({
      data: createTypeDto,
    });
  }

  async findAll(
    args?: Prisma.TypeWhereUniqueInput,
    select?: Prisma.TypeSelect<DefaultArgs>,
  ) {
    return await this.customPrisma.type.findMany({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async findAllByArgs(
    args?: TypePaginatedArgs,
    select?: Prisma.TypeSelect<DefaultArgs>,
  ) {
    try {
      const { limit: take, page, search, ...query } = args;
      const skip = page * take - take;

      const [categories, count] = await Promise.all([
        this.customPrisma.type.findMany({
          ...(query ? { where: query } : null),
          ...(select ? { select } : null),
          skip,
          take,
        }),
        this.customPrisma.type.count({
          ...(query ? { where: query } : null),
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
    args?: Prisma.TypeWhereUniqueInput,
    select?: Prisma.TypeSelect<DefaultArgs>,
  ) {
    return await this.customPrisma.type.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updateTypeDto: Prisma.TypeUpdateInput) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Type not found!');

    return this.customPrisma.type.update({
      where: {
        id,
      },
      data: updateTypeDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Type not found!');

    return this.customPrisma.type.delete({
      where: {
        id,
      },
    });
  }
}
