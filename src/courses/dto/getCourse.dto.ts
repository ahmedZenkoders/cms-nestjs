/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Course Code is required' })
  coursecode: string;
}
