import { PaymentMethod } from '@prisma/client';

export class CreatePaymentMethodDto {
  type: PaymentMethod;
  charge: number;
  isActive?: boolean;
}
