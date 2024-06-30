import { IsEmail } from '@nestjs/class-validator';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsEmail()
  studentId: string;

  @IsNotEmpty()
  @IsEmail()
  teacherId: string;

}
