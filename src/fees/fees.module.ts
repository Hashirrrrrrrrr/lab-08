// fees/fees.module.ts - custom providers, factory, alias and dependency injection
import { Module } from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';
import { StudentsModule } from '../students/students.module';
import {
  FEE_POLICY,
  FEE_RATE,
  FeePolicy,
  MeritFeePolicy,
  StandardFeePolicy,
} from './fee-policy.interface';
import { FeesInfoController } from './fees-info.controller';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({
  imports: [StudentsModule],
  // FeesInfoController is listed BEFORE FeesController so /api/fees/info is registered before /api/fees/:rollNumber
  controllers: [FeesInfoController, FeesController],
  providers: [
    FeesService,
    // useValue: fixed rate per credit hour
    {
      provide: FEE_RATE,
      useValue: 5000,
    },
    // useFactory: decides policy at runtime based on environment variable
    {
      provide: FEE_POLICY,
      useFactory: (_rate: number, logger: AppLogger): FeePolicy => {
        const policyName =
          process.env.FEE_POLICY === 'merit' ? 'merit' : 'standard';
        logger.log(`Active fee policy: ${policyName}`);
        return policyName === 'merit'
          ? new MeritFeePolicy()
          : new StandardFeePolicy();
      },
      inject: [FEE_RATE, AppLogger],
    },
    // useExisting: alias provider
    {
      provide: 'FEE_CALCULATOR',
      useExisting: FeesService,
    },
  ],
  exports: [FeesService, 'FEE_CALCULATOR'],
})
export class FeesModule {}
