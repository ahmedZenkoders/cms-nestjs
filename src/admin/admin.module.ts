/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DomainService } from 'src/domain/domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'src/domain/entities/domain';
import { Course } from 'src/courses/entities/course';
import { CourseService } from 'src/courses/courses.service';
@Module({
  imports:[TypeOrmModule.forFeature([Domain,Course])],
  providers: [AdminService,DomainService,CourseService],
  controllers: [AdminController]
})
export class AdminModule {}
