/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './createTeacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}