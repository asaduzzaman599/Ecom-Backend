class DeliveryInfo {
  address: string;
  phone: string;
}

export class CreateOrderDto {
  customerId?: string;
  stockId: string;
  deliveryInfoId: DeliveryInfo;
  paymentMethodId: string;
}
