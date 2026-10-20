// fees/fees-info.controller.ts - returns policy name and rate using FEE_CALCULATOR alias
import { Controller, Get, Inject } from '@nestjs/common';
import { FeesService } from './fees.service';

@Controller('api/fees')
export class FeesInfoController {
  constructor(
    @Inject('FEE_CALCULATOR') private readonly feeCalculator: FeesService,
  ) {}

  @Get('info')
  getInfo() {
    return this.feeCalculator.getInfo();
  }
}
