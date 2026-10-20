// courses/dto/create-course.dto.spec.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Department } from '../../students/student.entity';
import { CreateCourseDto } from './create-course.dto';

const good = {
  code: ' cs-420 ',
  title: '  Compilers ',
  creditHours: 3,
  instructor: ' Dr. Hamza Rauf ',
  department: Department.CS,
  description: '  Compiler design principles  ',
  tags: ['Theory', 'CORE'],
};

const check = (plain: object) =>
  validate(plainToInstance(CreateCourseDto, plain), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

describe('CreateCourseDto', () => {
  it('cleans the data (trim, uppercase code, lowercase tags)', () => {
    const dto = plainToInstance(CreateCourseDto, good);
    expect(dto.code).toBe('CS-420');
    expect(dto.title).toBe('Compilers');
    expect(dto.instructor).toBe('Dr. Hamza Rauf');
    expect(dto.description).toBe('Compiler design principles');
    expect(dto.tags).toEqual(['theory', 'core']);
  });

  it('accepts valid data', async () => {
    const errors = await check(good);
    expect(errors).toHaveLength(0);
  });

  it('reports every invalid field', async () => {
    const errors = await check({
      code: 'CS3',
      title: 'AI',
      creditHours: 9,
      instructor: 'Dr',
      department: 'Astrophysics',
    });
    const fields = errors.map((e) => e.property).sort();
    expect(fields).toEqual([
      'code',
      'creditHours',
      'department',
      'instructor',
      'title',
    ]);
  });

  it('rejects a number sent as text', async () => {
    const errors = await check({ ...good, creditHours: '3' });
    expect(errors.map((e) => e.property)).toContain('creditHours');
  });

  it('rejects an extra property (whitelist and forbidNonWhitelisted)', async () => {
    const errors = await check({ ...good, isAdmin: true });
    expect(errors.map((e) => e.property)).toContain('isAdmin');
  });

  it('enforces tags rules (rejects more than 5 tags)', async () => {
    const errors = await check({
      ...good,
      tags: ['one', 'two', 'three', 'four', 'five', 'six'],
    });
    expect(errors.map((e) => e.property)).toContain('tags');
  });
});
