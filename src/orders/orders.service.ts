import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto } from './dto/update-order.dto';
import { MasterService } from 'libs/master/master.service';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { CreateDeliveryInfoDto } from 'src/delivery-infos/dto/create-delivery-info.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { DeliveryInfosService } from 'src/delivery-infos/delivery-infos.service';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { CreatePaymentInfoDto } from 'src/payment-infos/dto/create-payment-info.dto';
import { PaymentInfosService } from 'src/payment-infos/payment-infos.service';
import {
  OrderStatus,
  PaymentType,
  Prisma,
  StockActivityType,
} from '@prisma/client';
import { OrderPaginatedArgs } from './dto/order.args';
import { StockActivitiesService } from 'src/stock-activities/stock-activities.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly customPrisma: MasterService,
    private readonly deliveryInfosService: DeliveryInfosService,
    private readonly orderItemsService: OrderItemsService,
    private readonly paymentInfosService: PaymentInfosService,
    private readonly stockActivitiesService: StockActivitiesService,
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
    return this.customPrisma.order.findUnique({
      where: args,
      include: {
        paymentInfo: { include: { paymentMethod: true } },
        orderItems: true,
      },
    });
  }

  async updateOrderStatus(dto: UpdateOrderStatusDto, context: RequestWithUser) {
    try {
      const order = await this.findOne({ id: dto.id });
      if (!order) throw new NotFoundException('order not found');

      let updatedStatus: OrderStatus;
      switch (status) {
        case OrderStatus.INPROGRESS:
        case OrderStatus.REJECTED:
          if (order.status === OrderStatus.INREVIEW) {
            updatedStatus = status;
          } else {
            throw new BadRequestException('order is not in review');
          }
          break;
        case OrderStatus.OUTFORDELIVERY:
          if (order.status === OrderStatus.INPROGRESS) {
            updatedStatus = status;
          } else {
            throw new BadRequestException('Order is not in progress');
          }
          break;
        case OrderStatus.DELIVERED:
        case OrderStatus.FAILED:
          if (order.status === OrderStatus.OUTFORDELIVERY) {
            updatedStatus = status;
          } else {
            throw new BadRequestException('Order is not out for delivery');
          }
          break;
        case OrderStatus.RETURNED:
          if (order.status === OrderStatus.DELIVERED) {
            updatedStatus = status;
          } else {
            throw new BadRequestException('Order is not delivered yet');
          }
          break;
        case OrderStatus.CANCELLED:
          if (
            order.status == OrderStatus.INPROGRESS ||
            order.status == OrderStatus.FAILED
          ) {
            updatedStatus = status;
          } else {
            throw new BadRequestException(`Order is already ${order.status}`);
          }
          break;
        case OrderStatus.REFUNDED:
          if (
            order.status == OrderStatus.CANCELLED ||
            order.status === OrderStatus.REJECTED ||
            order.status === OrderStatus.RETURNED
          ) {
            if (
              order.paymentInfo.paymentMethod.type === PaymentType.COD &&
              order.status !== OrderStatus.RETURNED
            ) {
              throw new BadRequestException(
                `Refund not possible for cash on delivery`,
              );
            } else {
              updatedStatus = status;
            }
          } else {
            throw new BadRequestException(`Order is already ${order.status}`);
          }
        case OrderStatus.COMPLETED:
          if (
            order.status == OrderStatus.REFUNDED ||
            order.status == OrderStatus.DELIVERED ||
            ((order.status == OrderStatus.CANCELLED ||
              order.status === OrderStatus.REJECTED) &&
              order.paymentInfo.paymentMethod.type === PaymentType.COD)
          ) {
            updatedStatus = status;
          } else {
            throw new BadRequestException(`Order is already ${order.status}`);
          }
          break;
        default:
          throw new BadRequestException('Invalid status');
      }
      const ordertems = order.orderItems.map((item) => {
        const damageItem = dto.damageItems.find(
          (d) => d?.orderItemId === item.id,
        );
        return {
          orderItemId: item.id,
          quantity: item.quantity,
          damageQty: damageItem?.damageQty ?? 0,
          stockId: item.stockId,
        };
      });
      return this.customPrisma.$transaction(async (tx) => {
        if (
          OrderStatus.CANCELLED === updatedStatus ||
          OrderStatus.REJECTED === updatedStatus
        ) {
          await Promise.all([
            ...ordertems.map((i) =>
              this.stockActivitiesService.increment(
                { ...i, type: StockActivityType.RETURNED },
                {
                  tx,
                  context,
                },
              ),
            ),
          ]);
        } else if (OrderStatus.RETURNED === updatedStatus) {
          await Promise.all([
            ...ordertems.map((i) =>
              this.stockActivitiesService.return(
                { ...i, type: StockActivityType.RETURNED },
                {
                  tx,
                  context,
                },
              ),
            ),
          ]);
        }
        return tx.order.update({
          where: { id: dto.id },
          data: { status: updatedStatus },
        });
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
