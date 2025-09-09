import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentInfoDto } from './dto/create-payment-info.dto';
import { UpdatePaymentInfoDto } from './dto/update-payment-info.dto';
import { DeliveryMethod, Prisma } from '@prisma/client';
import { Options } from 'libs/common/types/Options';
import { MasterService } from 'libs/master/master.service';
import { PaymentMethodsService } from 'src/payment-methods/payment-methods.service';
import { DeliveryMethodsService } from 'src/delivery-methods/delivery-methods.service';

@Injectable()
export class PaymentInfosService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly paymentMethodsService: PaymentMethodsService,
    private readonly deliveryMethodsService: DeliveryMethodsService,
  ) {}

  async create(createDeliveryInfoDto: CreatePaymentInfoDto, option?: Options) {
    const [paymentMethod, deliveryMethod] = await Promise.all([
      this.paymentMethodsService.findOne({
        id: createDeliveryInfoDto.paymentMethodId,
      }),
      this.deliveryMethodsService.findOne({
        id: createDeliveryInfoDto.deliveryMethodId,
      }),
    ]);

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    if (!deliveryMethod) {
      throw new NotFoundException('Delivery method not found');
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
