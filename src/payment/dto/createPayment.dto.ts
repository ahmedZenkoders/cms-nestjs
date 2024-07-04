/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Cannot send empty message' })
  amount: number;

  @IsNotEmpty({ message: 'Student Id is required' })
  @IsEmail()
  student_id: string;

  @IsNotEmpty({ message: 'Course Code is required' })
  @IsString()
  course_code: string;
}
