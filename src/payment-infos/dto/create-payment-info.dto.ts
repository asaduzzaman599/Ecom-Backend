import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentInfoDto {
  @IsOptional()
  @IsNumber()
  @Transform((value) => value ?? 0)
  additionalCharge: number;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsNotEmpty()
  @IsString()
  deliveryMethodId: string;
}
