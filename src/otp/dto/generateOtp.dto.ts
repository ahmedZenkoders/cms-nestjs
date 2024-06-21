/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
