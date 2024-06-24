/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnrolmentStatus } from 'src/enum/enrolment.enum';

export class CreateEnrolmentDto {
  @IsEnum(EnrolmentStatus)
  @IsNotEmpty()
  status: EnrolmentStatus = EnrolmentStatus.active;

  @IsNotEmpty()
  @IsString()
  coursecode: string;

  @IsNotEmpty()
  @IsEmail()
  student_id: string;
}
