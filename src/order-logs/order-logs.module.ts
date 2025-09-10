import { Module } from '@nestjs/common';
import { OrderLogsService } from './order-logs.service';
import { OrderLogsController } from './order-logs.controller';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule],
  controllers: [OrderLogsController],
  providers: [OrderLogsService],
  exports: [OrderLogsService],
})
export class OrderLogsModule {}
