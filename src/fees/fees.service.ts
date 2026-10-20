// fees/fees.service.ts - calculates fees using injected policy and students service
import { Inject, Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { FEE_POLICY, FEE_RATE, FeePolicy } from './fee-policy.interface';

@Injectable()
export class FeesService {
  constructor(
    @Inject(FEE_POLICY) private readonly feePolicy: FeePolicy,
    @Inject(FEE_RATE) private readonly ratePerCreditHour: number,
    private readonly studentsService: StudentsService,
  ) {}

  async calculateFee(rollNumber: string, creditHours: number) {
    const student = await this.studentsService.findOne(rollNumber);
    const total = this.feePolicy.calculate(
      creditHours,
      student.cgpa,
      this.ratePerCreditHour,
    );

    return {
      rollNumber: student.rollNumber,
      name: student.name,
      cgpa: student.cgpa,
      creditHours,
      policy: this.feePolicy.name,
      ratePerCreditHour: this.ratePerCreditHour,
      total,
    };
  }

  getInfo() {
    return {
      policy: this.feePolicy.name,
      ratePerCreditHour: this.ratePerCreditHour,
    };
  }
}
