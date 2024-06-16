/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginStudentDto {

    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

 
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string
}