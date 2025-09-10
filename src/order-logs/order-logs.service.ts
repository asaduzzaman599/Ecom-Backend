import { Injectable } from '@nestjs/common';
import { CreateOrderLogDto } from './dto/create-order-log.dto';
import { UpdateOrderLogDto } from './dto/update-order-log.dto';
import { Options } from 'libs/common/types/Options';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderLogsService {
  constructor(private readonly customPrisma: MasterService) {}
  create(createOrderLogDto: CreateOrderLogDto, options: Options) {
    return (options.tx ?? this.customPrisma).orderLog.create({
      data: { ...createOrderLogDto, triggerById: options.context.user.id },
    });
  }

  findAll(args?: Prisma.OrderLogWhereInput) {
    return this.customPrisma.orderLog.findMany({ where: args });
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLog`;
  }

  update(id: number, updateOrderLogDto: UpdateOrderLogDto) {
    return `This action updates a #${id} orderLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLog`;
  }
}
