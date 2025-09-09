import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';
import { RequestWithUser } from 'libs/common/types/request-with-user';

@Injectable()
export class DeliveryMethodsService {
  constructor(private readonly customPrisma: MasterService) {}
  create(
    createDeliveryMethodDto: CreateDeliveryMethodDto,
    context: RequestWithUser,
  ) {
    return this.customPrisma.deliveryMethod.create({
      data: { ...createDeliveryMethodDto, createdBy: context.user.id },
    });
  }

  findAll(args?: Prisma.DeliveryMethodWhereInput) {
    return this.customPrisma.deliveryMethod.findMany({ where: args });
  }

  findOne(args: Prisma.DeliveryMethodWhereUniqueInput) {
    return this.customPrisma.deliveryMethod.findUnique({ where: args });
  }

  async update(
    args: Prisma.DeliveryMethodWhereUniqueInput,
    updateDeliveryMethodDto: UpdateDeliveryMethodDto,
  ) {
    const exist = await this.findOne(args);
    if (!exist) throw new NotFoundException('Delivery method not found!');
    return this.customPrisma.deliveryMethod.update({
      where: args,
      data: updateDeliveryMethodDto,
    });
  }

  async remove(args: Prisma.DeliveryMethodWhereUniqueInput) {
    const exist = await this.findOne(args);
    if (!exist) throw new NotFoundException('Delivery method not found!');
    return this.customPrisma.deliveryMethod.delete({ where: args });
  }
}
