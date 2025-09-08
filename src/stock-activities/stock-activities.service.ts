import { Injectable } from '@nestjs/common';
import { CreateStockActivityDto } from './dto/create-stock-activity.dto';
import { UpdateStockActivityDto } from './dto/update-stock-activity.dto';

@Injectable()
export class StockActivitiesService {
  create(createStockActivityDto: CreateStockActivityDto) {
    return 'This action adds a new stockActivity';
  }

  findAll() {
    return `This action returns all stockActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockActivity`;
  }

  update(id: number, updateStockActivityDto: UpdateStockActivityDto) {
    return `This action updates a #${id} stockActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockActivity`;
  }
}
