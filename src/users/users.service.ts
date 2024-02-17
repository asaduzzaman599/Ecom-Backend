import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MasterService } from 'libs/master/master.service';
import { CreateAdminDto } from 'src/auth/dto/auth-input.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultArgs } from '@prisma/client/runtime/library'

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

    //TO DO: Error if user not found

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.customPrisma.user.delete({
      where: {
        id,
      },
    });
  }
}
