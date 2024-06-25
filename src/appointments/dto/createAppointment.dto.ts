/* eslint-disable prettier/prettier */

import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment.enum';

export class AppointmentDto {
  @IsNumber()
  student_id: number;

  @IsNumber()
  teacher_id: number;

  @IsNumber()
  slot_id: number;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsDate()
  @IsNotEmpty()
  appointment_date: Date;
}
