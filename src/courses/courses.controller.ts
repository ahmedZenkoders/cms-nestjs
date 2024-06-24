/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CourseService } from './courses.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/allCourses')
  async GetAll() {
    HttpCode(HttpStatus.OK);
    return await this.courseService.getAllCourses();
  }

  @Get('/courseById/:id')
  async GetCourse(@Param('id') id: string) {
    HttpCode(HttpStatus.OK);
    return await this.courseService.getCourseById(id);
  }
}
