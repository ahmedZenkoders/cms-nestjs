/* eslint-disable prettier/prettier */

import { IsEmail } from '@nestjs/class-validator';
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment.enum';

export class CreateAppointmentDto {
  @IsEmail()
  student_id: string;

  @IsEmail()
  teacher_id: string;

  @IsNumber()
  slot_id: number;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsDate()
  @IsNotEmpty()
  appointment_date: Date;

}
