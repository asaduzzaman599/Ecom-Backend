import { Module } from '@nestjs/common';
import { DeliveryMethodsService } from './delivery-methods.service';
import { DeliveryMethodsController } from './delivery-methods.controller';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule],
  controllers: [DeliveryMethodsController],
  providers: [DeliveryMethodsService],
  exports: [DeliveryMethodsService],
})
export class DeliveryMethodsModule {}
