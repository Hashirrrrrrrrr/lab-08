// test/courses.e2e-spec.ts - End-to-end tests for Courses API
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createValidationPipe } from '../src/common/pipes/app-validation.pipe';
import { COURSE_STORE, InMemoryCourseStore } from '../src/courses/store/course-store';
import { SEED_COURSES } from '../src/courses/courses.seed';

describe('Courses API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(COURSE_STORE)
      .useValue(new InMemoryCourseStore(SEED_COURSES))
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterEach(() => app.close());

  const goodCourse = {
    code: 'cs-420',
    title: '  Compilers ',
    creditHours: 3,
    instructor: ' Dr. Hamza Rauf ',
    department: 'Computer Science',
    tags: ['Theory', 'CORE'],
  };

  it('GET /api/courses returns 6 courses', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses').expect(200);
    expect(res.body).toHaveLength(6);
  });

  it('GET /api/courses/stats returns statistics before :code', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/stats').expect(200);
    expect(res.body.totalCourses).toBe(6);
    expect(res.body.totalCredits).toBe(17);
    expect(res.body.overloaded).toBe(false);
  });

  it('GET /api/courses/cs-101 accepts lowercase code and returns 200', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/cs-101').expect(200);
    expect(res.body.code).toBe('CS-101');
    expect(res.body.title).toBe('Introduction to Computing');
  });

  it('POST cleans the data and returns 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send(goodCourse)
      .expect(201);
    expect(res.body.code).toBe('CS-420');
    expect(res.body.title).toBe('Compilers');
    expect(res.body.tags).toEqual(['theory', 'core']);
  });

  it('POST twice with the same code returns 409', async () => {
    await request(app.getHttpServer()).post('/api/courses').send(goodCourse).expect(201);
    await request(app.getHttpServer()).post('/api/courses').send(goodCourse).expect(409);
  });

  it('POST with invalid data returns 400 and validation details', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({ code: 'CS3', title: 'AI', creditHours: 9 })
      .expect(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.length).toBeGreaterThanOrEqual(3);
  });

  it('POST with extra property returns 400', async () => {
    await request(app.getHttpServer())
      .post('/api/courses')
      .send({ ...goodCourse, isAdmin: true })
      .expect(400);
  });

  it('PATCH /api/courses/CS-301L with { code: "CS-999" } returns 400', async () => {
    await request(app.getHttpServer())
      .patch('/api/courses/CS-301L')
      .send({ code: 'CS-999' })
      .expect(400);
  });

  it('DELETE /api/courses/CS-101 returns 204, then GET returns 404', async () => {
    await request(app.getHttpServer()).delete('/api/courses/CS-101').expect(204);
    await request(app.getHttpServer()).get('/api/courses/CS-101').expect(404);
  });
});
