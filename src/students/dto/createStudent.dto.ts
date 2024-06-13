/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    contact: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;


}