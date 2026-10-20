// fees/fee-policy.interface.ts - contract and implementations for fee calculation
export const FEE_POLICY = Symbol('FEE_POLICY');
export const FEE_RATE = 'FEE_RATE';

export interface FeePolicy {
  readonly name: string;
  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number;
}

export class StandardFeePolicy implements FeePolicy {
  readonly name = 'standard';

  calculate(creditHours: number, _cgpa: number, ratePerCreditHour: number): number {
    return creditHours * ratePerCreditHour;
  }
}

export class MeritFeePolicy implements FeePolicy {
  readonly name = 'merit';

  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    const fullFee = creditHours * ratePerCreditHour;
    if (cgpa >= 3.5) {
      return fullFee * 0.5; // 50% discount
    }
    if (cgpa >= 3.0) {
      return fullFee * 0.75; // 25% discount
    }
    return fullFee; // no discount
  }
}
