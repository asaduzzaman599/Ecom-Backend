import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodsController } from './delivery-methods.controller';
import { DeliveryMethodsService } from './delivery-methods.service';

describe('DeliveryMethodsController', () => {
  let controller: DeliveryMethodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryMethodsController],
      providers: [DeliveryMethodsService],
    }).compile();

    controller = module.get<DeliveryMethodsController>(DeliveryMethodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
