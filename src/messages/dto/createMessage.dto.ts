/* eslint-disable prettier/prettier */

import { IsNotEmpty } from '@nestjs/class-validator';
import { IsString, IsEmail } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'senderType must be either "student" or "teacher"' })
  senderType: 'student' | 'teacher';

  @IsEmail()
  @IsNotEmpty()
  senderEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'receiverType must be either "student" or "teacher"' })
  receiverType: 'student' | 'teacher';

  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;
}
