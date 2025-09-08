import { Injectable } from '@nestjs/common';
import { CreatePaymentInfoDto } from './dto/create-payment-info.dto';
import { UpdatePaymentInfoDto } from './dto/update-payment-info.dto';
import { Prisma } from '@prisma/client';
import { Options } from 'libs/common/types/Options';
import { MasterService } from 'libs/master/master.service';
import { PaymentMethodsService } from 'src/payment-methods/payment-methods.service';

@Injectable()
export class PaymentInfosService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  async create(createDeliveryInfoDto: CreatePaymentInfoDto, option?: Options) {
    const paymentMethod = await this.paymentMethodsService.findOne({
      id: createDeliveryInfoDto.paymentMethodId,
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    return (option?.tx ?? this.customPrisma).paymentInfo.create({
      data: createDeliveryInfoDto,
    });
  }

  findOne(args: Prisma.DeliveryInfoWhereUniqueInput) {
    return this.customPrisma.deliveryInfo.findUnique({ where: args });
  }

  async update(
    id: string,
    updateDeliveryInfoDto: UpdatePaymentInfoDto,
    option?: Options,
  ) {
    if (updateDeliveryInfoDto.paymentMethodId) {
      const paymentMethod = await this.paymentMethodsService.findOne({
        id: updateDeliveryInfoDto.paymentMethodId,
      });

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
    }

    return (option?.tx ?? this.customPrisma).deliveryInfo.update({
      where: { id },
      data: updateDeliveryInfoDto,
    });
  }
}
