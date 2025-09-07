import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { StockCreateDto } from './dto/stock-create.dto';
import { StocksService } from './stocks.service';
import { StockPaginatedArgs } from './dto/stocks.args';
import { Public } from 'libs/decorator/public_access.decorator';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Admin()
  @Post()
  create(@Body() createGoodDto: StockCreateDto) {
    return this.stocksService.create(createGoodDto);
  }

  @Public()
  @Get()
  findAll(@Query() stockPaginatedArgs: StockPaginatedArgs) {
    return this.stocksService.findAllByArgs(stockPaginatedArgs);
  }
}
