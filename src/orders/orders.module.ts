import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MasterModule } from 'libs/master/master.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { DeliveryInfosModule } from 'src/delivery-infos/delivery-infos.module';
import { PaymentInfosModule } from 'src/payment-infos/payment-infos.module';

@Module({
  imports: [
    MasterModule,
    OrderItemsModule,
    DeliveryInfosModule,
    PaymentInfosModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
