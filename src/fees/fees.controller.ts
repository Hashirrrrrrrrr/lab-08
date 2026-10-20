// fees/fees.controller.ts - endpoint for calculating student fees
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RollNumberParamDto } from '../students/dto/roll-number-param.dto';
import { FeeQueryDto } from './dto/fee-query.dto';
import { FeesService } from './fees.service';

@Controller('api/fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get(':rollNumber')
  getFee(
    @Param() params: RollNumberParamDto,
    @Query() query: FeeQueryDto,
  ) {
    return this.feesService.calculateFee(params.rollNumber, query.creditHours);
  }
}
