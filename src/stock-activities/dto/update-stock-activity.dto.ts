import { PartialType } from '@nestjs/mapped-types';
import { CreateStockActivityDto } from './create-stock-activity.dto';

export class UpdateStockActivityDto extends PartialType(CreateStockActivityDto) {}
