// fees/dto/fee-query.dto.ts - validates query parameters for fee endpoint
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FeeQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'creditHours must be a whole number' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(24, { message: 'creditHours must be at most 24' })
  creditHours: number;
}
