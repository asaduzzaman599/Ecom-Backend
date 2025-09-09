import { PaymentMethod } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsOptional()
  @IsString()
  type: PaymentMethod['type'];

  @IsNotEmpty()
  @IsString()
  charge: number;

  @IsOptional()
  @IsString()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description: string;
}
