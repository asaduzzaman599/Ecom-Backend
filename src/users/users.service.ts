import { Injectable } from '@nestjs/common';
import { MasterService } from 'libs/master/master.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private customPrisma: MasterService) {}

  create(createUserDto: CreateUserDto) {
    return this.customPrisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.customPrisma.user.findMany();
  }
  async findOne(args: { phone: string }) {
    const user = await this.customPrisma.user.findUnique({
      where: args,
    });

    //TO DO: Error if user not found

    return user;
  }

  async findOneById(id: string) {
    const user = await this.customPrisma.user.findUnique({
      where: { id },
    });

    //TO DO: Error if user not found

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
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
