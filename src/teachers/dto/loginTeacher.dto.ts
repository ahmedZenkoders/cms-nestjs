/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginTeacherDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
