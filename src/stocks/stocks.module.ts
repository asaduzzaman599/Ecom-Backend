import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule],
  providers: [StocksService],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
