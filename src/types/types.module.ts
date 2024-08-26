import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
