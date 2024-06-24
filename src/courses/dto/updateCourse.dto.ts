/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './createCourse.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsNotEmpty()
  @IsEmail()
  teacher_id: string;
}
