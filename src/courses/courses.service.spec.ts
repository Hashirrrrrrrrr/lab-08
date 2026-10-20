// courses/courses.service.spec.ts - unit tests for CoursesService with fake store and mock logger
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLogger } from '../common/logger/app-logger';
import { Department } from '../students/student.entity';
import { CoursesService } from './courses.service';
import { CreditService } from './credit.service';
import { SEED_COURSES } from './courses.seed';
import { COURSE_STORE, InMemoryCourseStore } from './store/course-store';

describe('CoursesService', () => {
  let service: CoursesService;
  const logger = { log: jest.fn() };

  beforeEach(async () => {
    logger.log.mockClear();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CoursesService,
        CreditService,
        {
          provide: COURSE_STORE,
          useValue: new InMemoryCourseStore(SEED_COURSES),
        },
        { provide: AppLogger, useValue: logger },
      ],
    }).compile();

    service = moduleRef.get(CoursesService);
  });

  it('lists all courses', async () => {
    const courses = await service.findAll({});
    expect(courses).toHaveLength(6);
  });

  it('returns statistics with totalCourses, totalCredits, and overloaded', async () => {
    const stats = await service.stats();
    expect(stats.totalCourses).toBe(6);
    expect(stats.totalCredits).toBe(17);
    expect(stats.overloaded).toBe(false);
  });

  it('retrieves one course by code (case-insensitive)', async () => {
    const course = await service.findOne('cs-101');
    expect(course.code).toBe('CS-101');
    expect(course.title).toBe('Introduction to Computing');
  });

  it('throws NotFoundException for an unknown course', async () => {
    await expect(service.findOne('CS-999')).rejects.toThrow(NotFoundException);
  });

  it('creates a course, logs the creation, and rejects duplicate code', async () => {
    const dto = {
      code: 'CS-420',
      title: 'Compilers',
      creditHours: 3,
      instructor: 'Dr. Hamza Rauf',
      department: Department.CS,
      tags: ['theory', 'core'],
    };
    const created = await service.create(dto);
    expect(created.code).toBe('CS-420');
    expect(logger.log).toHaveBeenCalledWith('Created course CS-420');

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('updates a course with partial fields', async () => {
    const updated = await service.update('CS-450', { creditHours: 3 });
    expect(updated.creditHours).toBe(3);
    expect(logger.log).toHaveBeenCalledWith('Updated course CS-450');
  });

  it('deletes a course, logs deletion, and subsequent lookup throws NotFoundException', async () => {
    await service.remove('CS-101');
    expect(logger.log).toHaveBeenCalledWith('Deleted course CS-101');
    await expect(service.findOne('CS-101')).rejects.toThrow(NotFoundException);
  });
});
