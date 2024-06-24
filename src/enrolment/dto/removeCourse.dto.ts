/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RemoveCourseDto {
  @IsNotEmpty()
  @IsEmail()
  student_id: string;
  @IsNotEmpty()
  coursecode: string;
}
