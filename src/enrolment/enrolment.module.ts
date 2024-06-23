import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentService } from './enrolment.service';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, Course, Student, Teacher])],
  controllers: [EnrolmentController],
  providers: [EnrolmentService],
})
export class EnrolmentModule {}