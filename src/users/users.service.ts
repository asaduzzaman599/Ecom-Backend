import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AdminAccess } from 'libs/common/constant/admin-access';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { MasterService } from 'libs/master/master.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/libs/common/dto/pagination';

@Injectable()
export class UsersService {
  constructor(private customPrisma: MasterService) {}

  create(
    createUserDto: CreateUserDto,
    options?: { tx?: Prisma.TransactionClient },
  ) {
    return (options?.tx ?? this.customPrisma).user.create({
      data: createUserDto,
    });
  }

  async findAll(args?: Prisma.UserWhereUniqueInput) {
    return await this.customPrisma.user.findMany({
      ...(args ? { where: args } : null),
    });
  }
  async findAllPaginated(paginationOption: PaginationDto) {
    const page = +paginationOption.page;
    const limit = +paginationOption.limit;
    const skip = (page - 1) * limit;

    const queries: Prisma.UserFindManyArgs = {
      take: limit,
      skip,
    };
    const search = paginationOption.search;
    if (search) {
      queries.where = {
        OR: ['firstName', 'email', 'phone', 'lastName'].map((i) => ({
          [i]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      };
    }

    const [items, count] = await Promise.all([
      this.customPrisma.user.findMany(queries),
      this.customPrisma.user.count({ where: queries.where }),
    ]);

    return {
      items,
      count,
      page,
      limit,
      hasNextPage: count > limit * page,
      hasPreviousPage: page != 1 && count > 0,
      totalPage: Math.ceil(count / limit),
    };
  }

  async findOne(
    args?: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect<DefaultArgs>,
  ) {
    const user = await this.customPrisma.user.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    context?: RequestWithUser,
  ) {
    const args = {
      id:
        context && !AdminAccess.includes(context.user.role) //admin or forget pass with otp only allow pass change with out context
          ? context.user.id
          : id,
    };

    const user = await this.findOne(args);

    if (!user) throw new ForbiddenException('forbidden');

    return this.customPrisma.user.update({ where: args, data: updateUserDto });
  }

  remove(id: string) {
    return this.customPrisma.user.delete({
      where: {
        id,
      },
    });
  }
}
