import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class OrderItemsService {
  constructor(private readonly customPrisma: MasterService) {}
  create(
    createOrderItemDto: CreateOrderItemDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    return (option?.tx ?? this.customPrisma).orderItem.create({
      data: createOrderItemDto,
    });
  }

  async findAll(
    args?: Prisma.OrderItemWhereInput,
    select?: Prisma.OrderItemSelect<DefaultArgs>,
  ) {
    return await this.customPrisma.orderItem.findMany({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  findOne(
    args: Prisma.OrderItemWhereUniqueInput,
    select?: Prisma.OrderItemSelect,
  ) {
    return this.customPrisma.orderItem.findUnique({
      where: args,
      ...(select ? { select } : null),
    });
  }
}
