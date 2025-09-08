import { Injectable } from '@nestjs/common';
import { CreateStockActivityDto } from './dto/create-stock-activity.dto';
import { UpdateStockActivityDto } from './dto/update-stock-activity.dto';
import { Options } from 'libs/common/types/Options';
import { MasterService } from 'libs/master/master.service';
import { StocksService } from 'src/stocks/stocks.service';

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
    const data = {
      ...createStockActivityDto,
      ...(options.context ? { createdBy: options.context.user.id } : null),
    };
    if (options.tx) {
      await options.tx.stockActivities.create({ data });
      await this.stocksService.update(
        createStockActivityDto.stockId,
        { quantity: createStockActivityDto.quantity },
        { tx: options.tx },
      );
    }

    return this.customPrisma.$transaction(async (tx) => {
      await tx.stockActivities.create({ data });
      await this.stocksService.update(
        createStockActivityDto.stockId,
        { quantity: createStockActivityDto.quantity },
        { tx },
      );
    });
  }

  increment(createStockActivityDto: CreateStockActivityDto, options?: Options) {
    return this.create({ ...createStockActivityDto }, options);
  }

  decrement(createStockActivityDto: CreateStockActivityDto, options?: Options) {
    return this.create({ ...createStockActivityDto }, options);
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
