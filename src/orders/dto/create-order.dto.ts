import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

class OrderItem {
  @IsNotEmpty()
  @IsString()
  stockId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

class OrderDeliveryInfo {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

class OrderPaymentMethodInfo {
  @IsOptional()
  @IsNumber()
  @Transform((value) => value ?? 0)
  additionalCharge: number;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}
export class CreateOrderDto {
  @IsOptional()
  @IsString()
  remarks?: string;

  @IsNotEmpty()
  @IsString()
  customerId?: string;

  @IsArray()
  @ArrayNotEmpty()
  orderItems: OrderItem[];

  deliveryInfo: OrderDeliveryInfo;

  paymentInfo: OrderPaymentMethodInfo;
}
