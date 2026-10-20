// courses/credit.service.ts - a plain class provider with no dependencies
import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';

@Injectable()
export class CreditService {
  totalCredits(courses: Course[]): number {
    return courses.reduce((sum, course) => sum + (course.creditHours || 0), 0);
  }

  isOverloaded(totalCredits: number): boolean {
    return totalCredits > 18;
  }
}
