import { Injectable } from '@nestjs/common';
import { CreateStockActivityDto } from './dto/create-stock-activity.dto';
import { UpdateStockActivityDto } from './dto/update-stock-activity.dto';
import { Options } from 'libs/common/types/Options';
import { MasterService } from 'libs/master/master.service';
import { StocksService } from 'src/stocks/stocks.service';
import { StockActivityType } from '@prisma/client';

@Injectable()
export class StockActivitiesService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly stocksService: StocksService,
  ) {}
  async create(
    createStockActivityDto: CreateStockActivityDto,
    options?: Options,
  ) {
    if (options.tx) {
      return this.createHelper(createStockActivityDto, { tx: options.tx });
    }

    return this.customPrisma.$transaction(async (tx) => {
      return this.createHelper(createStockActivityDto, { tx });
    });
  }

  async createHelper(
    createStockActivityDto: CreateStockActivityDto,
    options?: Options,
  ) {
    const data = {
      ...createStockActivityDto,
      ...(options.context ? { createdBy: options.context.user.id } : null),
    };
    await options.tx.stockActivities.create({ data });

    const { type, quantity, damageQty } = createStockActivityDto;
    let updatedQuantity = quantity;
    if (type === StockActivityType.DAMAGED) {
      updatedQuantity = 0;
    }

    if (
      StockActivityType.ONSALE === type ||
      StockActivityType.DEDUCTED === type
    ) {
      updatedQuantity = -quantity;
    }

    await this.stocksService.update(
      createStockActivityDto.stockId,
      {
        quantity: updatedQuantity,
        damageQty,
      },
      { tx: options.tx },
    );
  }

  increment(createStockActivityDto: CreateStockActivityDto, options?: Options) {
    return this.create({ ...createStockActivityDto }, options);
  }

  decrement(createStockActivityDto: CreateStockActivityDto, options?: Options) {
    return this.create({ ...createStockActivityDto }, options);
  }

  return(createStockActivityDto: CreateStockActivityDto, options?: Options) {
    if (createStockActivityDto.damageQty === 0) {
      return this.increment(
        { ...createStockActivityDto, type: StockActivityType.RETURNED },
        options,
      );
    } else {
      const quantity =
        createStockActivityDto.quantity - createStockActivityDto.damageQty;

      if (quantity > 0) {
        this.increment(
          {
            orderItemId: createStockActivityDto.orderItemId,
            quantity,
            type: StockActivityType.PARTIALLYRETURNED,
            stockId: createStockActivityDto.stockId,
            damageQty: createStockActivityDto.damageQty,
          },
          options,
        );
      } else {
        this.create(
          { ...createStockActivityDto, type: StockActivityType.DAMAGED },
          options,
        );
      }
    }
  }

  findAll() {
    return `This action returns all stockActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockActivity`;
  }

  update(id: number, updateStockActivityDto: UpdateStockActivityDto) {
    return `This action updates a #${id} stockActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockActivity`;
  }
}
