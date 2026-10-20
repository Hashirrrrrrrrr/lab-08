// courses/courses.controller.ts - routes for courses feature
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CodeParamDto } from './dto/code-param.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { ReplaceCourseDto, UpdateCourseDto } from './dto/update-course.dto';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.coursesService.findAll(query);
  }

  // Must be declared before ':code' so 'stats' is not treated as a course code
  @Get('stats')
  stats() {
    return this.coursesService.stats();
  }

  @Get(':code')
  findOne(@Param() params: CodeParamDto) {
    return this.coursesService.findOne(params.code);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Put(':code')
  replace(@Param() params: CodeParamDto, @Body() dto: ReplaceCourseDto) {
    return this.coursesService.replace(params.code, dto);
  }

  @Patch(':code')
  update(@Param() params: CodeParamDto, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(params.code, dto);
  }

  @Delete(':code')
  @HttpCode(204)
  remove(@Param() params: CodeParamDto) {
    return this.coursesService.remove(params.code);
  }
}
