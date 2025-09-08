import { Injectable } from '@nestjs/common';
import { CreateDeliveryInfoDto } from './dto/create-delivery-info.dto';
import { UpdateDeliveryInfoDto } from './dto/update-delivery-info.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';
import { Options } from 'libs/common/types/Options';

@Injectable()
export class DeliveryInfosService {
  constructor(private readonly customPrisma: MasterService) {}

  create(
    createDeliveryInfoDto: CreateDeliveryInfoDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    return (option?.tx ?? this.customPrisma).deliveryInfo.create({
      data: createDeliveryInfoDto,
    });
  }

  findOne(args: Prisma.DeliveryInfoWhereUniqueInput) {
    return this.customPrisma.deliveryInfo.findUnique({ where: args });
  }

  update(
    id: string,
    updateDeliveryInfoDto: UpdateDeliveryInfoDto,
    option?: Options,
  ) {
    return (option?.tx ?? this.customPrisma).deliveryInfo.update({
      where: { id },
      data: updateDeliveryInfoDto,
    });
  }
}
