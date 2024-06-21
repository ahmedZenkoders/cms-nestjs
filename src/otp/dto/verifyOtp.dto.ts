import { IsEmail } from '@nestjs/class-validator';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyOtpDto {
    @IsNotEmpty({ message: 'OTP is required' })
    @IsNumberString({}, { message: 'OTP must be a numeric string' })
    otp: string;

    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
}
