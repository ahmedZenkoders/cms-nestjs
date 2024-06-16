/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty({ message: 'Course Code is required' })
    coursecode: string;

    @IsString()
    @IsNotEmpty({ message: 'Course Name is required' })
    name: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;
    
    @IsString()
    @IsNotEmpty({ message: 'Course Type is required' })
    type: string;

}