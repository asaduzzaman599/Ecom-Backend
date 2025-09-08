import { Module } from '@nestjs/common';
import { StockActivitiesService } from './stock-activities.service';
import { StockActivitiesController } from './stock-activities.controller';
import { MasterModule } from 'libs/master/master.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [MasterModule, StocksModule],
  controllers: [StockActivitiesController],
  providers: [StockActivitiesService],
  exports: [StockActivitiesService],
})
export class StockActivitiesModule {}
