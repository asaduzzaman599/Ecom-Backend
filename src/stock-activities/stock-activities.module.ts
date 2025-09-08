import { Module } from '@nestjs/common';
import { StockActivitiesService } from './stock-activities.service';
import { StockActivitiesController } from './stock-activities.controller';

@Module({
  controllers: [StockActivitiesController],
  providers: [StockActivitiesService]
})
export class StockActivitiesModule {}
