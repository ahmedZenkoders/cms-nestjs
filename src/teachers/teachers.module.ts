/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Student } from 'src/students/entities/student';
import { StudentsService } from 'src/students/students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Course,Enrolment,Student])],
  controllers: [TeachersController],
  providers: [TeachersService, CourseService,EnrolmentService,StudentsService],
})
export class TeachersModule {}
