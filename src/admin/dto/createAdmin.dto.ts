/* eslint-disable prettier/prettier */
import { IsOptional, IsUrl } from "@nestjs/class-validator";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAdminDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;

    @IsNotEmpty({ message: 'Name is required' })
    username: string;

    @IsOptional()
    @IsUrl({ allow_underscores: true })
    img: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact is required' })
    contact: string;

    @IsNotEmpty({ message: 'Age is required' })
    age: number;

    @IsNotEmpty({ message: 'Address is required' })
    address: string;

}
