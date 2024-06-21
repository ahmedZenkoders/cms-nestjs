/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Course])],
  controllers: [TeachersController],
  providers: [TeachersService, CourseService],
})
export class TeachersModule {}
