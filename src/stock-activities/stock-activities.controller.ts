import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockActivitiesService } from './stock-activities.service';
import { CreateStockActivityDto } from './dto/create-stock-activity.dto';
import { UpdateStockActivityDto } from './dto/update-stock-activity.dto';

@Controller('stock-activities')
export class StockActivitiesController {
  constructor(private readonly stockActivitiesService: StockActivitiesService) {}

  @Post()
  create(@Body() createStockActivityDto: CreateStockActivityDto) {
    return this.stockActivitiesService.create(createStockActivityDto);
  }

  @Get()
  findAll() {
    return this.stockActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockActivitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockActivityDto: UpdateStockActivityDto) {
    return this.stockActivitiesService.update(+id, updateStockActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockActivitiesService.remove(+id);
  }
}
