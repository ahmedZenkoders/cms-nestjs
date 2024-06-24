/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DomainService } from 'src/domain/domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domain/entities/domain';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';
import { Student } from 'src/students/entities/student';
import { StudentsService } from 'src/students/students.service';
@Module({
  imports: [TypeOrmModule.forFeature([Domain, Course,Teacher,Student])],
  providers: [AdminService, DomainService,StudentsService, CourseService,TeachersService],
  controllers: [AdminController],
})
export class AdminModule {}
