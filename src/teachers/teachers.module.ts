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
import { Slot } from 'src/slots/entities/slots';
import { SlotService } from 'src/slots/slots.service';
import { Appointment } from 'src/appointments/entities/appointment';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      Enrolment,
      Student,
      Course,
      Slot,
      Payment,
      Appointment,
    ]),
  ],
  controllers: [TeachersController],
  providers: [
    TeachersService,
    StudentsService,
    EnrolmentService,
    CourseService,
    SlotService,
    AppointmentsService,
    MailService,
    PaymentService,
    StripeService,
  ],
})
export class TeachersModule {}
