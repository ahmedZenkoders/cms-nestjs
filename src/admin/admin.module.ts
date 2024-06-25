/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DomainService } from 'src/domain/domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domain/entities/domain';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';
import { Slot } from 'src/slots/entities/slots';
import { SlotService } from 'src/slots/slots.service';
import { StudentsService } from 'src/students/students.service';
import { Student } from 'src/students/entities/student';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Appointment } from 'src/appointments/entities/appointment';
@Module({
  imports: [TypeOrmModule.forFeature([Domain, Course, Teacher, Slot,Student,Appointment])],
  providers: [
    AdminService,
    DomainService,
    CourseService,
    TeachersService,
    SlotService,
    StudentsService,
    AppointmentsService
  ],
  controllers: [AdminController],
})
export class AdminModule {}
