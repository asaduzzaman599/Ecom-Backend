import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MasterService } from 'libs/master/master.service';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { CreateDeliveryInfoDto } from 'src/delivery-infos/dto/create-delivery-info.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { DeliveryInfosService } from 'src/delivery-infos/delivery-infos.service';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { CreatePaymentInfoDto } from 'src/payment-infos/dto/create-payment-info.dto';
import { PaymentInfosService } from 'src/payment-infos/payment-infos.service';
import { Prisma } from '@prisma/client';
import { OrderPaginatedArgs } from './dto/order.args';

@Injectable()
export class OrdersService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly deliveryInfosService: DeliveryInfosService,
    private readonly orderItemsService: OrderItemsService,
    private readonly paymentInfosService: PaymentInfosService,
  ) {}
  create(createOrderDto: CreateOrderDto, context: RequestWithUser) {
    try {
      const customerId: string = context.user.id;
      const { deliveryInfo, paymentInfo, orderItems } = createOrderDto;
      const deliveryInfoDto: CreateDeliveryInfoDto = {
        customerId,
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
      };
      const paymentMethodInfoDto: CreatePaymentInfoDto = {
        additionalCharge: paymentInfo.additionalCharge,
        paymentMethodId: paymentInfo.paymentMethodId,
        deliveryMethodId: paymentInfo.deliveryMethodId,
      };
      return this.customPrisma.$transaction(async (tx) => {
        const savedDeliveryInfo = await this.deliveryInfosService.create(
          deliveryInfoDto,
          { tx },
        );

        const paymentInfo = await this.paymentInfosService.create(
          paymentMethodInfoDto,
          { tx },
        );

        const orderDto: {
          remarks: string;
          customerId: string;
          paymentInfoId: string;
          deliveryInfoId: string;
        } = {
          remarks: createOrderDto.remarks,
          customerId,
          paymentInfoId: paymentInfo.id,
          deliveryInfoId: savedDeliveryInfo.id,
        };

        const order = await tx.order.create({ data: orderDto });

        const orderItemsDto: CreateOrderItemDto[] = orderItems.map((i) => ({
          ...i,
          orderId: order.id,
        }));

        await this.orderItemsService.createMany(orderItemsDto, { tx, context });
        return order;
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll(args: Prisma.OrderWhereInput) {
    return this.customPrisma.order.findMany({ where: args });
  }

  async findAllByArgs(args?: OrderPaginatedArgs, select?: Prisma.StockSelect) {
    try {
      const { limit: take, page, search, ...query } = args;
      const skip = page * take - take;

      const searchQueries = {
        OR: [].map((i) => ({
          [i]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      };

      const queries: Prisma.OrderFindManyArgs = {
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
      const [orders, count] = await Promise.all([
        this.customPrisma.order.findMany(queries),
        this.customPrisma.order.count({
          ...(query ? { where: queries.where } : null),
          select: {
            _all: true,
          },
        }),
      ]);

      return {
        items: orders,
        total: count._all,
        hasNextPage: count._all / take > page,
        hasPreviousPage: page > 1,
        page,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  findOne(args: Prisma.OrderWhereUniqueInput) {
    return this.customPrisma.order.findUnique({ where: args });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
