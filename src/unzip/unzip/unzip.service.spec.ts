import { Test, TestingModule } from '@nestjs/testing';
import { UnzipService } from './unzip.service';

describe('UnzipService', () => {
  let service: UnzipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnzipService],
    }).compile();

    service = module.get<UnzipService>(UnzipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
