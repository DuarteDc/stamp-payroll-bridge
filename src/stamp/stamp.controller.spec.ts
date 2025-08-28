import { Test, TestingModule } from '@nestjs/testing';
import { StampController } from './stamp.controller';
import { StampService } from './stamp.service';

describe('StampController', () => {
  let controller: StampController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StampController],
      providers: [StampService],
    }).compile();

    controller = module.get<StampController>(StampController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
