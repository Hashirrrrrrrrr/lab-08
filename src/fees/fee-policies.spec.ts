// fees/fee-policies.spec.ts - unit tests for StandardFeePolicy and MeritFeePolicy
import { MeritFeePolicy, StandardFeePolicy } from './fee-policy.interface';

describe('Fee Policies', () => {
  const rate = 5000;
  const standardPolicy = new StandardFeePolicy();
  const meritPolicy = new MeritFeePolicy();

  describe('StandardFeePolicy', () => {
    it('calculates full fee (creditHours * rate) regardless of CGPA', () => {
      expect(standardPolicy.calculate(12, 3.8, rate)).toBe(60000);
      expect(standardPolicy.calculate(12, 2.5, rate)).toBe(60000);
    });

    it('has name "standard"', () => {
      expect(standardPolicy.name).toBe('standard');
    });
  });

  describe('MeritFeePolicy', () => {
    it('has name "merit"', () => {
      expect(meritPolicy.name).toBe('merit');
    });

    it('gives 50% discount for CGPA >= 3.5 (boundary check: 3.5 and above)', () => {
      // Exact boundary 3.5
      expect(meritPolicy.calculate(12, 3.5, rate)).toBe(30000);
      // Above boundary 3.8
      expect(meritPolicy.calculate(12, 3.8, rate)).toBe(30000);
    });

    it('gives 25% discount for CGPA >= 3.0 and < 3.5 (boundary check: 3.0)', () => {
      // Exact boundary 3.0
      expect(meritPolicy.calculate(12, 3.0, rate)).toBe(45000);
      // Within range 3.25
      expect(meritPolicy.calculate(12, 3.25, rate)).toBe(45000);
    });

    it('gives no discount for CGPA below 3.0 (boundary check: 2.99 and 1.9)', () => {
      expect(meritPolicy.calculate(12, 2.99, rate)).toBe(60000);
      expect(meritPolicy.calculate(10, 1.9, rate)).toBe(50000);
    });
  });
});
