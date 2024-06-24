/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { CourseService } from 'src/courses/courses.service';

import { Roles } from 'src/decorator/role.decorator';
import { DomainService } from 'src/domain/domain.service';
import { CreateDomainDto } from 'src/domain/dto/createDomain.dto';
import { Role } from 'src/enum/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { PaginationSearchDto } from 'src/students/dto/pagination-search.dto';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { AdminService } from './admin.service';


@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('admin')
export class AdminController {
  constructor(
    private domainService: DomainService,
    private courseService: CourseService,
    private studentService:StudentsService,
    private teacherService:TeachersService,
    private adminService: AdminService

  ) {}

  @Roles(Role.admin)
  @Post('addDomain')
  async addDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain = await this.domainService.addAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.CREATED);
    return domain;
  }


  @Roles(Role.admin)
  @Post('removeDomain')
  async removeDomain(@Body() createdomaindto: CreateDomainDto) {
    const domain =
      await this.domainService.removeAllowedDomain(createdomaindto);
    HttpCode(HttpStatus.OK);
    return domain;
  }


  @Roles(Role.admin)
  @Get('getCourses')
  async getAllCourses() {
    HttpCode(HttpStatus.ACCEPTED);
    return await this.courseService.getAllCourses();
  }


  @Roles(Role.admin)
  @Get('viewStudents')
  async viewAllStudents(@Query() paginationSearchDto: PaginationSearchDto){
    HttpCode(HttpStatus.ACCEPTED);
    return await this.studentService.getAllStudents(paginationSearchDto);
  }


  @Roles(Role.admin)
  @Get('viewTeachers')
  async viewAllTeachers(@Query() paginationSearchDto: PaginationSearchDto){
    HttpCode(HttpStatus.ACCEPTED);
    return await this.teacherService.getAllTeachers(paginationSearchDto);
  }


  @Roles(Role.admin)
  @Patch('/suspendStudent/:email')
  async SuspendStudent(@Param('email') email:string){
    return await this.adminService.SuspendStudent(email)
  }


  @Roles(Role.admin)
  @Patch('/suspendTeacher/:email')
  async SuspendTeacher(@Param('email') email:string){
    return await this.adminService.SuspendTeacher(email)
  }
}
