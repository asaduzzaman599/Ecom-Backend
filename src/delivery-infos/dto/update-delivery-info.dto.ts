import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryInfoDto } from './create-delivery-info.dto';

export class UpdateDeliveryInfoDto extends PartialType(CreateDeliveryInfoDto) {}
