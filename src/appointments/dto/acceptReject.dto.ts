/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment.enum';

export class AcceptRejectDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
