import { Module } from '@nestjs/common';
import { PaymentInfosService } from './payment-infos.service';
import { MasterModule } from 'libs/master/master.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';

@Module({
  imports: [MasterModule, PaymentMethodsModule],
  providers: [PaymentInfosService],
  exports: [PaymentInfosService],
})
export class PaymentInfosModule {}
