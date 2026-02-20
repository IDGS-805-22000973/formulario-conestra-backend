import { Test, TestingModule } from '@nestjs/testing';
import { TestEngineService } from './test-engine.service';

describe('TestEngineService', () => {
  let service: TestEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestEngineService],
    }).compile();

    service = module.get<TestEngineService>(TestEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
