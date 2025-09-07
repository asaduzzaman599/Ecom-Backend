import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { GoodsService } from './goods.service';
import { GoodsPaginatedArgs } from './dto/goods.arg';
import { Public } from 'libs/decorator/public_access.decorator';
import { Admin } from 'libs/decorator/admin_access.decorator';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Admin()
  @Post()
  create(@Body() createGoodDto: CreateGoodDto) {
    return this.goodsService.create(createGoodDto);
  }

  @Public()
  @Get()
  findAll(@Query() GoodsPaginatedArgs: GoodsPaginatedArgs) {
    return this.goodsService.findAllByArgs(GoodsPaginatedArgs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.findOne({ id });
  }

  @Admin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(id, updateGoodDto);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsService.remove(id);
  }
}
