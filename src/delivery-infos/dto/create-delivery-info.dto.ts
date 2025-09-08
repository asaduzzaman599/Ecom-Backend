import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryInfoDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;
}
