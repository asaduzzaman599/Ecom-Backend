import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { MasterModule } from 'libs/master/master.module';
import { StocksModule } from 'src/stocks/stocks.module';
import { StockActivitiesModule } from 'src/stock-activities/stock-activities.module';

@Module({
  imports: [MasterModule, StocksModule, StockActivitiesModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
