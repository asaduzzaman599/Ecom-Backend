import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderLogDto {
  @IsNotEmpty()
  @IsString()
  triggerById: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
