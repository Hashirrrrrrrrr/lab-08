// courses/courses.module.ts - wires courses providers together
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppLogger } from '../common/logger/app-logger';
import { APP_CONFIG, AppConfig } from '../core/app-config';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreditService } from './credit.service';
import { SEED_COURSES } from './courses.seed';
import {
  COURSE_STORE,
  CourseStore,
  InMemoryCourseStore,
  JsonFileCourseStore,
} from './store/course-store';

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CreditService,
    {
      provide: COURSE_STORE,
      useFactory: (config: AppConfig, logger: AppLogger): CourseStore => {
        logger.log(`Using ${config.storage} storage`);
        return config.storage === 'memory'
          ? new InMemoryCourseStore(SEED_COURSES)
          : new JsonFileCourseStore(join(process.cwd(), 'data', 'courses.json'));
      },
      inject: [APP_CONFIG, AppLogger],
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
