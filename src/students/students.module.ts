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
import { Appointment } from 'src/appointments/entities/appointment';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { MailService } from 'src/mail/mail.service';
import { Payment } from 'src/payment/entities/payment';
import { PaymentService } from 'src/payment/payment.service';
import { StripeService } from 'src/stripe/stripe.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Enrolment,
      Course,
      Teacher,
      Appointment,
      Payment,
    ]),
  ],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    EnrolmentService,
    CourseService,
    AppointmentsService,
    TeachersService,
    MailService,
    PaymentService,
    StripeService,
  ],
})
export class StudentsModule {}
