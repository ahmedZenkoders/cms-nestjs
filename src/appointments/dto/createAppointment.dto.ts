/* eslint-disable prettier/prettier */
import { IsDateString, IsString } from '@nestjs/class-validator';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Student id is required' })
  student_id: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Teacher id is required' })
  teacher_id: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Appointment date is required' })
  appointment_date: Date;

  @IsString()
  @IsNotEmpty({ message: 'Start time is required' })
  start_time: string;

  @IsString()
  @IsNotEmpty({ message: 'End time is required' })
  end_time: string;
}
