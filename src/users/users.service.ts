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

  findAll() {
    return this.customPrisma.user.findMany();
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
    context: RequestWithUser,
  ) {
    const args = {
      id: AdminAccess.includes(context.user.role) ? id : context.user.id,
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
