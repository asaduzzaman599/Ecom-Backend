import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDeliveryMethodDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  charge: number;
}
