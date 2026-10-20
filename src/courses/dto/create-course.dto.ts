// courses/dto/create-course.dto.ts
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Department } from '../../students/student.entity';

const trim = ({ value }: { value: any }) =>
  typeof value === 'string' ? value.trim() : value;
const trimUpper = ({ value }: { value: any }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreateCourseDto {
  @Transform(trimUpper)
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;

  @Transform(trim)
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  title: string;

  @IsInt({ message: 'creditHours must be a whole number' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(4, { message: 'creditHours must be at most 4' })
  creditHours: number;

  @Transform(trim)
  @IsString({ message: 'instructor must be a string' })
  @MinLength(3, { message: 'instructor must be at least 3 characters' })
  instructor: string;

  @IsEnum(Department, {
    message: `department must be one of: ${Object.values(Department).join(', ')}`,
  })
  department: Department;

  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'description must be a string' })
  @MaxLength(200, { message: 'description must be at most 200 characters' })
  description?: string;

  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => (typeof v === 'string' ? v.trim().toLowerCase() : v))
      : value,
  )
  @IsArray({ message: 'tags must be an array' })
  @ArrayMaxSize(5, { message: 'tags must have at most 5 items' })
  @IsString({ each: true, message: 'each tag must be a string' })
  tags?: string[];
}
