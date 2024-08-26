import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'libs/errors/all-exceptions.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { GuardProvider } from 'libs/providers/auth-guard.provider';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from './categories/categories.module';
import { MasterModule } from 'libs/master/master.module';
import { GoodsModule } from './goods/goods.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [
    MasterModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    CategoriesModule,
    GoodsModule,
    AttachmentsModule,
    OrdersModule,
    PaymentMethodsModule,
    TypesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...GuardProvider,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
