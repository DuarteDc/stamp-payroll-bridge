import { Test, TestingModule } from '@nestjs/testing';
import { SatService } from './sat.service';

describe('SatService', () => {
  let service: SatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatService],
    }).compile();

    service = module.get<SatService>(SatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
