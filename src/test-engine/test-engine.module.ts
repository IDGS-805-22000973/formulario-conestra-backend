import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResponse } from '../entities/test-response.entity';
import { User } from '../entities/user.entity';
import { TestEngineService } from './test-engine.service';
import { TestEngineController } from './test-engine.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestResponse, User]), EmailModule],
  providers: [TestEngineService],
  controllers: [TestEngineController],
})
export class TestEngineModule {}