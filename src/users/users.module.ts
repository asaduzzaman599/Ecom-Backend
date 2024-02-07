import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MasterModule } from 'libs/master/master.module';

@Module({
  imports: [MasterModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
