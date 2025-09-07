import { Size, Stock } from '@prisma/client';
import { Min } from 'class-validator';

export class StockCreateDto {
  @Min(0)
  quantity: number;
  size?: Stock['size'] = Size.NONE;
  color?: string;
  description?: string;
  goodId: string;
}
