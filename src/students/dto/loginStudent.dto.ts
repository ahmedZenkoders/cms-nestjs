/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginStudentDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

 
    @IsNotEmpty()
    @IsString()
    password: string
}