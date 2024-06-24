/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { Student } from './entities/student';
import { Course } from 'src/courses/entities/course';
@Module({
  imports: [TypeOrmModule.forFeature([Student, Course, Enrolment])],
  controllers: [StudentsController],
  providers: [StudentsService, EnrolmentService],
})
export class StudentsModule {}
