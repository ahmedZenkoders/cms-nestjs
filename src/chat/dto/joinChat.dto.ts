/* eslint-disable prettier/prettier */
import { IsEmail } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';

export class JoinChatDto {
  @IsNotEmpty()
  @IsEmail()
  student_id: string;

  @IsNotEmpty()
  @IsEmail()
  teacher_id: string;
}
