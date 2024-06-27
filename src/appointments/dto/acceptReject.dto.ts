/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment.enum';

export class ApproveRejectDto {
  @IsNotEmpty({message:"Student Email is required"})
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
