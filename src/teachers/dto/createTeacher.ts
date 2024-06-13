/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateTeacherDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @IsNotEmpty()
    @IsString()
    contact: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;


}