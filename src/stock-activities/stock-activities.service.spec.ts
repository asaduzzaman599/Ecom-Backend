import { Test, TestingModule } from '@nestjs/testing';
import { StockActivitiesService } from './stock-activities.service';

describe('StockActivitiesService', () => {
  let service: StockActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockActivitiesService],
    }).compile();

    service = module.get<StockActivitiesService>(StockActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
