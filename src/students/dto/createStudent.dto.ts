/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateStudentDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
  
    @IsNotEmpty({ message: 'Name is required' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact is required' })
    contact: string;

    @IsNotEmpty({ message: 'Age is required' })
    @IsNumber()
    age: number;

    @IsNotEmpty({ message: 'Address is required' })
    address:string
}