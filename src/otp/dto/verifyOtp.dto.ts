/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'OTP is required' })
  @IsString({message: 'OTP must be a numeric string'})
  otp: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
