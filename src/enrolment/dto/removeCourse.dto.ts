import { IsEmail, IsNotEmpty } from 'class-validator';

export class RemoveCourseDto {
  @IsNotEmpty()
  @IsEmail()
  student_id: string;
  @IsNotEmpty()
  course_code: string;
}