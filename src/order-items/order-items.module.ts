import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { MasterModule } from 'libs/master/master.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [MasterModule, StocksModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
