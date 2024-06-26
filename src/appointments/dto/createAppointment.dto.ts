/* eslint-disable prettier/prettier */
import { IsString } from '@nestjs/class-validator';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsEmail()
  @IsNotEmpty()
  student_id: string;

  @IsEmail()
  @IsNotEmpty()
  teacher_id: string;

  @IsNotEmpty()
  appointment_date: Date;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;
}
