import { PaymentMethod } from '@prisma/client';

export class CreatePaymentMethodDto {
  type: PaymentMethod['type'];
  charge: number;
  isActive?: boolean;
  description: string;
}
