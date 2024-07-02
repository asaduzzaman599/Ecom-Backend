import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { MasterModule } from 'libs/master/master.module';

@Module({
  controllers: [PaymentMethodsController, MasterModule],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
