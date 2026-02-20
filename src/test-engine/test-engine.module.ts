import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResponse } from '../entities/test-response.entity';
import { User } from '../entities/user.entity';
import { TestEngineService } from './test-engine.service';
import { TestEngineController } from './test-engine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestResponse, User])],
  providers: [TestEngineService],
  controllers: [TestEngineController],
})
export class TestEngineModule {}