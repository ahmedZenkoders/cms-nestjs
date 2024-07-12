/* eslint-disable prettier/prettier */
import { IsEmail } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'studentID cannot be empty' })
  @IsEmail()
  studentId: string;

  @IsNotEmpty({ message: 'teacher id cannot be empty' })
  @IsEmail()
  teacherId: string;
}
