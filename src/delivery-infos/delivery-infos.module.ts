import { Module } from '@nestjs/common';
import { DeliveryInfosService } from './delivery-infos.service';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule],
  providers: [DeliveryInfosService],
  exports: [DeliveryInfosService],
})
export class DeliveryInfosModule {}
