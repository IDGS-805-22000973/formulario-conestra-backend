import { Test, TestingModule } from '@nestjs/testing';
import { TestEngineController } from './test-engine.controller';

describe('TestEngineController', () => {
  let controller: TestEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestEngineController],
    }).compile();

    controller = module.get<TestEngineController>(TestEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
