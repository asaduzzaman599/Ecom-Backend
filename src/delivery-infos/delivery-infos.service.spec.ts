import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryInfosService } from './delivery-infos.service';

describe('DeliveryInfosService', () => {
  let service: DeliveryInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryInfosService],
    }).compile();

    service = module.get<DeliveryInfosService>(DeliveryInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
