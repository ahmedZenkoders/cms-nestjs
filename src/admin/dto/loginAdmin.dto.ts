/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAdminDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string
}