import { StockActivities } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateStockActivityDto {
  @IsNotEmpty()
  type: StockActivities['type'];
}
