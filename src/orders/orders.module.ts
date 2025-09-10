import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MasterModule } from 'libs/master/master.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { DeliveryInfosModule } from 'src/delivery-infos/delivery-infos.module';
import { PaymentInfosModule } from 'src/payment-infos/payment-infos.module';
import { StockActivitiesModule } from 'src/stock-activities/stock-activities.module';
import { OrderLogsModule } from 'src/order-logs/order-logs.module';

@Module({
  imports: [
    MasterModule,
    OrderItemsModule,
    DeliveryInfosModule,
    PaymentInfosModule,
    StockActivitiesModule,
    OrderLogsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
