/* eslint-disable prettier/prettier */
import { IsEmail } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsEmail()
  studentId: string;

  @IsNotEmpty()
  @IsEmail()
  teacherId: string;
}
