// courses/courses.seed.ts - starting data for the in-memory course store
import { Department } from '../students/student.entity';
import { Course } from './course.entity';

export const SEED_COURSES: Course[] = [
  {
    code: 'CS-101',
    title: 'Introduction to Computing',
    creditHours: 3,
    instructor: 'Dr. Farhan',
    department: Department.CS,
    description: 'Foundational computing course',
    tags: ['core', 'intro'],
  },
  {
    code: 'CS-201',
    title: 'Data Structures',
    creditHours: 3,
    instructor: 'Dr. Hamza',
    department: Department.CS,
    description: 'Fundamental data structures and algorithms',
    tags: ['core', 'algorithms'],
  },
  {
    code: 'CS-301L',
    title: 'Full Stack Web Development',
    creditHours: 3,
    instructor: 'Dr. Hamza Rauf',
    department: Department.SE,
    description: 'Modern web development with NestJS and React',
    tags: ['web', 'lab'],
  },
  {
    code: 'CS-305',
    title: 'Database Systems',
    creditHours: 3,
    instructor: 'Dr. Sara Khan',
    department: Department.DS,
    description: 'Relational databases and SQL',
    tags: ['database', 'core'],
  },
  {
    code: 'CS-410',
    title: 'Artificial Intelligence',
    creditHours: 3,
    instructor: 'Dr. Ali Raza',
    department: Department.DS,
    description: 'Search algorithms and heuristics',
    tags: ['ai', 'elective'],
  },
  {
    code: 'CS-450',
    title: 'Software Architecture',
    creditHours: 2,
    instructor: 'Dr. Bilal Siddiqui',
    department: Department.SE,
    description: 'Architectural styles and design patterns',
    tags: ['architecture', 'se'],
  },
];
