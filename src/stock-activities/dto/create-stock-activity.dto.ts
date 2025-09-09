import { StockActivities } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateStockActivityDto {
  @IsNotEmpty()
  type: StockActivities['type'];

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  damageQty?: number;

  @IsNotEmpty()
  stockId: string;

  @IsOptional()
  orderItemId?: string;
}
