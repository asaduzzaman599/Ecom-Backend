import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { DeliveryMethodsService } from './delivery-methods.service';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { ALL } from 'libs/decorator/all_access.decorator';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { RequestWithUser } from 'libs/common/types/request-with-user';

@Controller('delivery-methods')
export class DeliveryMethodsController {
  constructor(
    private readonly deliveryMethodsService: DeliveryMethodsService,
  ) {}

  @Admin()
  @Post()
  create(
    @Body() createDeliveryMethodDto: CreateDeliveryMethodDto,
    @Request() context: RequestWithUser,
  ) {
    return this.deliveryMethodsService.create(createDeliveryMethodDto, context);
  }

  @ALL()
  @Get('all')
  findAll() {
    return this.deliveryMethodsService.findAll();
  }

  @ALL()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryMethodsService.findOne({ id });
  }

  @Admin()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryMethodDto: UpdateDeliveryMethodDto,
  ) {
    return this.deliveryMethodsService.update({ id }, updateDeliveryMethodDto);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryMethodsService.remove({ id });
  }
}
