import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MasterModule } from 'libs/master/master.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';

@Module({
  imports: [MasterModule, OrderItemsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
