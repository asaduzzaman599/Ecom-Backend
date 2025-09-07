import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { MasterService } from 'libs/master/master.service';
import { PaymentMethodPaginatedArgs } from './dto/payment-method.args';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly masterService: MasterService) {}
  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.masterService.paymentMethod.create({
      data: createPaymentMethodDto,
    });
  }

  findAll() {
    return this.masterService.paymentMethod.findMany();
  }

  async findAllByArgs(
    args: PaymentMethodPaginatedArgs,
    select?: Prisma.PaymentMethodSelect,
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

      const queries: Prisma.PaymentMethodFindManyArgs = {
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

      const [paymentMethods, count] = await Promise.all([
        this.masterService.paymentMethod.findMany(queries),
        this.masterService.paymentMethod.count({
          ...(query ? { where: queries.where } : null),
          select: {
            _all: true,
          },
        }),
      ]);

      return {
        items: paymentMethods,
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
    args: Prisma.PaymentMethodWhereUniqueInput,
    select?: Prisma.PaymentMethodSelect,
  ) {
    return this.masterService.paymentMethod.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Products not found!');

    return this.masterService.paymentMethod.update({
      where: { id },
      data: updatePaymentMethodDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });

    if (!exist) throw new NotFoundException('Products not found!');

    return this.masterService.paymentMethod.delete({
      where: { id },
    });
  }
}
