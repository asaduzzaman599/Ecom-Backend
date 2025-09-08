import { StockActivities } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockActivityDto {
  @IsNotEmpty()
  type: StockActivities['type'];

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  stockId: string;
}
