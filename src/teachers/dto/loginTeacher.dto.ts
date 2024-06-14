/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class LoginTeacherDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string
}