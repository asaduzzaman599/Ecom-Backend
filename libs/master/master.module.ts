import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { MasterService } from './master.service';

@Module({
  imports: [PrismaModule],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
