/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';
import { Student } from 'src/students/entities/student';
import { StudentsService } from 'src/students/students.service';
import { Payment } from 'src/payment/entities/payment';
import { PaymentService } from 'src/payment/payment.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Enrolment } from 'src/enrolment/entities/enrolment';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Teacher, Student, Payment, Enrolment]),
  ],
  providers: [
    CourseService,
    TeachersService,
    StudentsService,
    PaymentService,
    StripeService,
  ],
  controllers: [CoursesController],
})
export class CoursesModule {}
