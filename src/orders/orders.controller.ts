import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { CUSTOMER } from 'libs/decorator/customer_access.decorator';
import { ALL } from 'libs/decorator/all_access.decorator';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { OrderArgs, OrderPaginatedArgs } from './dto/order.args';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CUSTOMER()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWithUser,
  ) {
    return this.ordersService.create(createOrderDto, req);
  }

  @ALL()
  @Get()
  findAllByArgs(@Query() args: OrderPaginatedArgs) {
    return this.ordersService.findAllByArgs(args);
  }

  @ALL()
  @Get('all')
  findAll(@Query() args: OrderArgs) {
    return this.ordersService.findAll(args);
  }

  @ALL()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne({ id });
  }

  @Admin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
