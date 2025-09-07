import { IsNotEmpty, Min } from 'class-validator';

export class CreateOrderItemDto {
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stockId: string;

  @IsNotEmpty()
  orderId: string;
}
