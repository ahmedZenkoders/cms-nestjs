/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentService } from './enrolment.service';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { CourseService } from 'src/courses/courses.service';
import { Payment } from 'src/payment/entities/payment';
import { StripeService } from 'src/stripe/stripe.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrolment, Course, Student, Teacher, Payment]),
  ],
  controllers: [EnrolmentController],
  providers: [EnrolmentService, CourseService, StripeService, MailService],
})
export class EnrolmentModule {}
