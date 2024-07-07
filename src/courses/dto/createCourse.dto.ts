/* eslint-disable prettier/prettier */
import { IsOptional } from '@nestjs/class-validator';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CourseType } from 'src/enum/course-type.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Course Code is required' })
  coursecode: string;
  @IsString()
  @IsNotEmpty({ message: 'Course name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Course description is required' })
  description: string;

  @IsOptional()
  price: number;

  @IsNotEmpty({ message: 'Course deadline is required' })
  @IsDateString()
  deadline: Date;

  
  type:CourseType

  @IsNotEmpty({ message: 'Teacher id is required' })
  @IsEmail()
  teacher_id: string;
}
