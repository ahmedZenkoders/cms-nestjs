import { Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course';
import { Teacher } from 'src/teachers/entities/teacher';
import { TeachersService } from 'src/teachers/teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course,Teacher])],
  providers: [CourseService,TeachersService],
  controllers: [CoursesController],
})
export class CoursesModule {}
