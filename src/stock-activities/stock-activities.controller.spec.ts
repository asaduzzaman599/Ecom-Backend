import { Test, TestingModule } from '@nestjs/testing';
import { StockActivitiesController } from './stock-activities.controller';
import { StockActivitiesService } from './stock-activities.service';

describe('StockActivitiesController', () => {
  let controller: StockActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockActivitiesController],
      providers: [StockActivitiesService],
    }).compile();

    controller = module.get<StockActivitiesController>(StockActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
