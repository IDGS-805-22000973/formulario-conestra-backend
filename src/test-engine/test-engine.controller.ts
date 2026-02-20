// src/test-engine/test-engine.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { TestEngineService } from './test-engine.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('test')
export class TestEngineController {
  constructor(private readonly testEngineService: TestEngineService) { }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  @Roles('user')
  async submitTest(@Request() req, @Body() body: { testType: 'MOSS' | '16PF', answers: any }) {
    // req.user.userId viene del token desencriptado
    return this.testEngineService.processTest(
      req.user.userId,
      body.testType,
      body.answers
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('results')
  @Roles('admin')
  async getAllResults() {
    return this.testEngineService.findAllResults();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('results/user/:userId')
  @Roles('admin')
  findByUser(@Param('userId') userId: string) {
    return this.testEngineService.findResultsByUserId(+userId);
  }

}