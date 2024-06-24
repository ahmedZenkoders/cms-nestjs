/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Student } from './entities/student';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { Teacher } from 'src/teachers/entities/teacher';
@Module({
  imports: [TypeOrmModule.forFeature([Student, Course, Enrolment,Teacher])],
  controllers: [StudentsController],
  providers: [StudentsService, EnrolmentService,CourseService,TeachersService],
})
export class StudentsModule {}
