import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from 'src/slots/entities/slots';
import { SlotService } from 'src/slots/slots.service';
import { Student } from 'src/students/entities/student';
import { StudentsService } from 'src/students/students.service';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';
import { AppointmentsController } from './appointments.controller';

@Module({
   imports:[TypeOrmModule.forFeature([Student, Teacher,Slot])],
   providers: [
    TeachersService,
    SlotService,
    StudentsService
  ],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
