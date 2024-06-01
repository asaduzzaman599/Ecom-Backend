import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AdminAccess } from 'libs/common/constant/admin-access';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { MasterService } from 'libs/master/master.service';
import { CreateAdminDto } from 'src/auth/dto/auth-input.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private customPrisma: MasterService) {}

  create(createUserDto: CreateUserDto | CreateAdminDto) {
    return this.customPrisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(args?: Prisma.UserWhereUniqueInput) {
    const result = await this.customPrisma.user.findMany({
      ...(args ? { where: args } : null),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return result.map(({ password, ...data }) => data);
  }

  async findOne(
    args?: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect<DefaultArgs>,
  ) {
    const user = await this.customPrisma.user.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    context?: RequestWithUser,
  ) {
    const args = {
      id:
        context && !AdminAccess.includes(context.user.role) //admin or forget pass with otp only allow pass change with out context
          ? context.user.id
          : id,
    };

    const user = await this.findOne(args);

    if (!user) throw new ForbiddenException('forbidden');

    return this.customPrisma.user.update({ where: args, data: updateUserDto });
  }

  remove(id: string) {
    return this.customPrisma.user.delete({
      where: {
        id,
      },
    });
  }
}
