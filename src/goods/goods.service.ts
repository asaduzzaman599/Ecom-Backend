import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MasterService } from 'libs/master/master.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';

@Injectable()
export class GoodsService {
  constructor(private readonly customPrisma: MasterService) {}
  create(createGoodDto: CreateGoodDto) {
    return this.customPrisma.goods.create({
      data: createGoodDto,
    });
  }

  findAll(
    args?: Prisma.GoodsWhereUniqueInput,
    select?: Prisma.GoodsSelect<DefaultArgs>,
  ) {
    return this.customPrisma.goods.findUnique({
      ...(args ? { where: args } : null),
      // ...(select ? { select } : null),
      include: {
        category: true,
      },
    });
  }

  findOne(
    args: Prisma.GoodsWhereUniqueInput,
    select?: Prisma.GoodsSelect<DefaultArgs>,
  ) {
    return this.customPrisma.goods.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updateGoodDto: UpdateGoodDto) {
    const exist = await this.findOne({ id });

    if (!exist) throw new NotFoundException('Products not found!');

    return this.customPrisma.goods.update({
      where: { id },
      data: updateGoodDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });

    if (!exist) throw new NotFoundException('Products not found!');

    return this.customPrisma.goods.delete({
      where: { id },
    });
  }
}
