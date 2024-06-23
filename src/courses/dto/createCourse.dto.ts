import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({message:"Course Code is required"})
  coursecode: string;
  @IsString()
  @IsNotEmpty({message:"Course name is required"})
  name: string;
  @IsString()
  @IsNotEmpty({message:"Course description is required"})
  description: string;

  @IsNotEmpty({message:"Course deadline is required"})
  @IsDateString()
  deadline: Date;

  @IsNotEmpty({message:"Teacher id is required"})
  @IsEmail()
  teacher_id: string;

}