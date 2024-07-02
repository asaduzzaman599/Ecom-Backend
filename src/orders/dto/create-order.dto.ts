import { OrderStatus } from '@prisma/client';

class DeliveryInfo {
  address: string;
  phone: string;
}

export class CreateOrderDto {
  status: OrderStatus;
  customerId?: string;
  stockId: string;
  deliveryInfoId: DeliveryInfo;
  paymentMethodId: string;
}
