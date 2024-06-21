/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CourseService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/createCourse.dto';
import { RemoveCourseDto } from 'src/courses/dto/removeCourse.dto';

@Controller('teacher')
export class TeachersController {
  constructor(private courseService: CourseService) {}

  @Post('addCourse')
  async addCourse(@Body() createcoursedto: CreateCourseDto) {
    const course = await this.courseService.addCourse(createcoursedto);
    HttpCode(HttpStatus.CREATED);
    return course;
  }

  @Post('removeCourse')
  async removeCourse(@Body() removecoursedto: RemoveCourseDto) {
    const course = await this.courseService.removeCourse(removecoursedto);
    HttpCode(HttpStatus.OK);
    return course;
  }
}
