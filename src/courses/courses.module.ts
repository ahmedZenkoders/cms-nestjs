import { Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course';

@Module({
  imports:[TypeOrmModule.forFeature([Course])],
  providers: [CourseService],
  controllers: [CoursesController]
})
export class CoursesModule {}
