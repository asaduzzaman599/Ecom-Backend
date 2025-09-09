import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma, StockActivityType } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateStockActivityDto } from 'src/stock-activities/dto/create-stock-activity.dto';
import { StockActivitiesService } from 'src/stock-activities/stock-activities.service';
import { Options } from 'libs/common/types/Options';

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly stocksService: StocksService,
    private readonly stockActivitiesService: StockActivitiesService,
  ) {}
  create(
    createOrderItemDto: CreateOrderItemDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    return (option?.tx ?? this.customPrisma).orderItem.create({
      data: createOrderItemDto,
    });
  }

  async createMany(
    createOrderItemDto: CreateOrderItemDto[],
    options?: Options,
  ) {
    const stockIds = createOrderItemDto.map((item) => item.stockId);
    const uniqueIds = new Set(stockIds);
    const stocks = await this.stocksService.findAll({
      id: { in: [...uniqueIds] },
    });

    if (stocks.length !== uniqueIds.size) {
      throw new NotFoundException('Stocks not matched or found');
    }

    await Promise.all(
      stocks.map((stock) => {
        if (stock.quantity === 0) {
          throw new NotFoundException(`Stock out for ${stock.good.title}`);
        }

        const itemDtos = createOrderItemDto.filter(
          (i) => i.stockId === stock.id,
        );
        const quantity = itemDtos.reduce((acc, item) => acc + item.quantity, 0);

        if (quantity > stock.quantity) {
          throw new NotFoundException(
            `Stock not enough for ${stock.good.title}, only ${stock.quantity} left`,
          );
        }
        const stockActivityDto: CreateStockActivityDto = {
          quantity: quantity,
          stockId: stock.id,
          type: StockActivityType.ONSALE,
        };
        return this.stockActivitiesService.decrement(stockActivityDto, options);
      }),
    );

    return (options?.tx ?? this.customPrisma).orderItem.createMany({
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
