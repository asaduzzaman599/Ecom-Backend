import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { MasterModule } from 'libs/master/master.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [MasterModule, StocksModule],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
