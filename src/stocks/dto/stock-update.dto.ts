import { PartialType } from '@nestjs/mapped-types';
import { StockCreateDto } from './stock-create.dto';

export class StockUpdateDto extends PartialType(StockCreateDto) {}
