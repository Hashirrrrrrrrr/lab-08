// courses/dto/update-course.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

// PUT: every field except code (code comes from the URL)
export class ReplaceCourseDto extends OmitType(CreateCourseDto, ['code'] as const) {}

// PATCH: the same fields, but all optional
export class UpdateCourseDto extends PartialType(
  OmitType(CreateCourseDto, ['code'] as const),
) {}
