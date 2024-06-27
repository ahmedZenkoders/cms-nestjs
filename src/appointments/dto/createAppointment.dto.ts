/* eslint-disable prettier/prettier */
import { IsEnum, IsString } from '@nestjs/class-validator';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment.enum';

export class CreateAppointmentDto {
  @IsEmail()
  @IsNotEmpty()
  student_id: string;

  @IsEmail()
  @IsNotEmpty()
  teacher_id: string;

  @IsNotEmpty()
  appointment_date: Date;

  @IsEnum(AppointmentStatus)
  status:AppointmentStatus

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;
}
