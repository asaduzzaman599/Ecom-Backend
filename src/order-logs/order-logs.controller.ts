import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderLogsService } from './order-logs.service';
import { UpdateOrderLogDto } from './dto/update-order-log.dto';

@Controller('order-logs')
export class OrderLogsController {
  constructor(private readonly orderLogsService: OrderLogsService) {}

  @Get()
  findAll() {
    return this.orderLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderLogDto: UpdateOrderLogDto,
  ) {
    return this.orderLogsService.update(+id, updateOrderLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderLogsService.remove(+id);
  }
}
