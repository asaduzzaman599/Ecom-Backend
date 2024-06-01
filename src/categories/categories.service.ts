import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MasterService } from 'libs/master/master.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private customPrisma: MasterService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.customPrisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(
    args?: Prisma.CategoryWhereUniqueInput,
    select?: Prisma.CategorySelect<DefaultArgs>,
  ) {
    return await this.customPrisma.category.findMany({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async findOne(
    args?: Prisma.CategoryWhereUniqueInput,
    select?: Prisma.CategorySelect<DefaultArgs>,
  ) {
    return await this.customPrisma.category.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });
  }

  async update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Category not found!');

    return this.customPrisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const exist = await this.findOne({ id });
    if (!exist) throw new NotFoundException('Category not found!');

    return this.customPrisma.category.delete({
      where: {
        id,
      },
    });
  }
}
